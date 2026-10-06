<?php

namespace MediaWiki\Extension\CustomInvite;

use MediaWiki\MediaWikiServices;
use RequestContext;

class InviteHooks {

    /**
     * Contextually derives a secure 32-byte key from the central wiki secret.
     *
     * @return string
     */
    public static function deriveContextualKey(): string {
        $config = MediaWikiServices::getInstance()->getMainConfig();
        $secretKey = $config->get( 'SecretKey' );
        return hash_hkdf( 'sha256', $secretKey, 32, 'mediawiki-custom-invite-token' );
    }

    /**
     * Dynamically injects the 'createaccount' right into the current user's rights array
     * if they provide a valid, unexpired JWT token or if they have an active token session.
     *
     * @param mixed $user The User object whose rights are being computed
     * @param array &$rights The array of rights strings assigned to the user
     * @return bool Always true to continue hook chain execution
     */
    public static function onUserGetRights( $user, array &$rights ): bool {
        $context = RequestContext::getMain();
        $title = $context->getTitle();

        // Check if we are interacting with account creation or login actions
        if ( $title && ( $title->isSpecial( 'CreateAccount' ) || $title->isSpecial( 'Userlogin' ) ) ) {
            $session = $context->getRequest()->getSession();
            
            // 1. Try to fetch token from URL parameter (GET)
            $jwt = $_GET['invite_token'] ?? null;

            if ( $jwt ) {
                // If present in URL, validate it and persist it to the session
                if ( self::isTokenValid( $jwt ) ) {
                    $session->set( 'custominvite_token', $jwt );
                    if ( !in_array( 'createaccount', $rights, true ) ) {
                        $rights[] = 'createaccount';
                    }
                    return true;
                }
            }

            // 2. Fallback to Session (For POST form submission or multi-step signup)
            $sessionJwt = $session->get( 'custominvite_token' );
            if ( $sessionJwt && self::isTokenValid( $sessionJwt ) ) {
                if ( !in_array( 'createaccount', $rights, true ) ) {
                    $rights[] = 'createaccount';
                }
            }
        }
        return true;
    }

    /**
     * Helper method to parse, cryptographically verify, and check the expiration of the JWT.
     *
     * @param string $jwt
     * @return bool
     */
    private static function isTokenValid( string $jwt ): bool {
        $parts = explode( '.', $jwt );
        if ( count( $parts ) !== 3 ) {
            return false;
        }

        [ $base64UrlHeader, $base64UrlPayload, $base64UrlSignature ] = $parts;
        
        $secret = self::deriveContextualKey();
        $remainder = strlen( $base64UrlSignature ) % 4;
        if ( $remainder ) {
            $base64UrlSignature .= str_repeat( '=', 4 - $remainder );
        }
        $signature = base64_decode( strtr( $base64UrlSignature, '-_', '+/' ) );
        $validSignature = hash_hmac( 'sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secret, true );

        if ( !hash_equals( $validSignature, $signature ) ) {
            return false; 
        }

        $payloadRemainder = strlen( $base64UrlPayload ) % 4;
        if ( $payloadRemainder ) {
            $base64UrlPayload .= str_repeat( '=', 4 - $payloadRemainder );
        }
        $payload = json_decode( base64_decode( strtr( $base64UrlPayload, '-_', '+/' ) ), true );

        return ( $payload && isset( $payload['exp'] ) && $payload['exp'] > time() );
    }

    /**
     * Adds a static link to the custom Special Page in the user menu.
     * 
     * @param mixed $skinTemplate
     * @param array &$links
     */
    public static function onSkinTemplateNavigationUniversal( $skinTemplate, array &$links ): void {
        $authority = $skinTemplate->getAuthority();

        if ( $authority->isAllowed( 'custominvite-generate' ) ) {
            $titleFactory = MediaWikiServices::getInstance()->getTitleFactory();
            $title = $titleFactory->newFromText( 'Special:GenerateInvite' );
            
            if ( $title ) {
                $links['user-menu']['custom-invite-link'] = [
                    'text' => 'Generate invite link',
                    'href' => $title->getFullURL(),
                    'active' => false,
                    'icon' => 'userAdd',
                    'class' => 'custom-invite-trigger'
                ];
            }
        }
    }
}

