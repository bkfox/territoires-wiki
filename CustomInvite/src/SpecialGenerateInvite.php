<?php

namespace MediaWiki\Extension\CustomInvite;

use UnlistedSpecialPage;
use MediaWiki\MediaWikiServices;
use PermissionsError;


class SpecialGenerateInvite extends UnlistedSpecialPage {

    public function __construct() {
        // Registered with our custom permission constraint
        parent::__construct( 'GenerateInvite', 'invitelink' );
    }

    /**
     * Execution handling for the Special Page
     *
     * @param string|null $subPage
     */
    public function execute( $subPage ) {
        $this->checkPermissions();

        $request = $this->getRequest();
        $output = $this->getOutput();

        // 1. Get duration from GET parameter or fallback to LocalSettings / 7 days
        $config = MediaWikiServices::getInstance()->getMainConfig();
        $defaultDuration = $config->has( 'CustomInviteDuration' ) ? (int)$config->get( 'CustomInviteDuration' ) : 86400 * 7;
        
        $duration = $request->getInt( 'duration', $defaultDuration );

        // 2. Generate the JWT token
        $jwt = $this->generateJWT( $duration );

        // 3. Construct the target sign-up URL
        $titleFactory = MediaWikiServices::getInstance()->getTitleFactory();
        $targetTitle = $titleFactory->newFromText( 'Special:CreateAccount' );
        $inviteUrl = $targetTitle->getFullURL( [ 'invite_token' => $jwt ] );

        // 4. API / Fetch friendly check: if the client expects JSON, return it directly instead of redirecting
        if ( $request->getHeader( 'Accept' ) && strpos( $request->getHeader( 'Accept' ), 'application/json' ) !== false ) {
            $output->disable();
            $response = $request->response();
            $response->header( 'Content-Type: application/json; charset=utf-8' );
            echo json_encode( [ 'success' => true, 'url' => $inviteUrl, 'token' => $jwt ] );
            return;
        }

        // 5. Standard Browser Behavior: HTTP 302 Redirect
        $output->redirect( $inviteUrl, '302' );
    }

    /**
     * Generates a basic HS256 JWT signed with the native HKDF-derived key.
     */
    private function generateJWT( int $duration ): string {
        $header = json_encode( [ 'alg' => 'HS256', 'typ' => 'JWT' ] );
        $payload = json_encode( [
            'iss' => 'mediawiki_invite',
            'exp' => time() + $duration
        ] );

        $base64UrlHeader = str_replace( [ '+', '/', '=' ], [ '-', '_', '' ], base64_encode( $header ) );
        $base64UrlPayload = str_replace( [ '+', '/', '=' ], [ '-', '_', '' ], base64_encode( $payload ) );

        $secret = InviteHooks::deriveContextualKey();

        $signature = hash_hmac( 'sha256', $base64UrlHeader . '.' . $base64UrlPayload, $secret, true );
        $base64UrlSignature = str_replace( [ '+', '/', '=' ], [ '-', '_', '' ], base64_encode( $signature ) );

        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }
}

