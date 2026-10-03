<?php

use MediaWiki\Skin\SkinMustache;



class ContextBuilder {

    private array $allowedDataPaths = [
        # 'contentNav.views' => 'content_navigation.views',
        # 'content_navigation.actions',
        'data-logos.icon' => 'data-logos.icon',
        'page.isArticle' => 'is-article',
        'page.isMainPage' => 'is-mainpage',
        # 'sidebar'
    ];

    public function getContext($skin, $data): array {
        $out = $skin->getOutput();
        $title = $skin->getSkin()->getTitle();

        $context = [
            'siteName'   => $skin->getContext()->getConfig()->get( 'Sitename' ),
            'page' => [
                'title'  => $title->getPrefixedText(),
                'categories' => $this->getPageCategories($skin),
                'indicators' => $this->getPageIndicators($skin),
            ],
            "portlets" => $this->getPortlets($data["data-portlets"]),
            "nav" => $this->getPortlets($data["data-portlets-sidebar"]),
            'zzzz' => $data
        ];
        
        foreach ( $this->allowedDataPaths as $targetPath => $path ) {
            $value = $this->getNestedValue( $data, $path );
            $context = $this->setNestedValue( $context, $targetPath, $value );
        }

        return $context;
    }

    private function getNestedValue( $data, string $path ) {
        $keys = explode( '.', $path );
        foreach ( $keys as $key ) {
            if ( is_array( $data ) && array_key_exists( $key, $data ) ) {
                $data = $data[$key];
            } elseif ( is_object( $data ) && isset( $data->$key ) ) {
                $data = $data->$key;
            } else {
                return null;
            }
        }
        return $data;
    }

    private function setNestedValue( array $targetArray, string $path, $value ): array {
        $keys = explode( '.', $path );
        $current = &$targetArray;

        foreach ( $keys as $i => $key ) {
            if ( $i === count( $keys ) - 1 ) {
                // Dernière clé : on pose la valeur finale
                $current[$key] = $value;
            } else {
                // Clé intermédiaire : on s'assure d'avoir un sous-tableau propre
                if ( !isset( $current[$key] ) || !is_array( $current[$key] ) ) {
                    $current[$key] = [];
                }
                $current = &$current[$key];
            }
        }

        return $targetArray;
    }

    private function getPageCategories($skin): array {
        $data = [];
        foreach ( $skin->getOutput()->getCategories() as $categoryName ) {
            $data[] = str_replace( '_', ' ', $categoryName );
        }
        return $data;
    }

    private function getPageIndicators($skin): array {
        $data = [];
        foreach ( $skin->getOutput()->getIndicators() as $id => $htmlContent ) {
            $data['indicators'][] = [
                'id' => $id,
                'text' => strip_tags( $htmlContent ) // Nettoie le HTML pour ne garder que la valeur brute
            ];
        }
        return $data;
    }

    private function getPortlets($dataPortlets): array {
        $results = [];
        foreach ($dataPortlets as $type => $group) {
            if(!isset($group["array-items"]))
                continue;
            $result = [
                "id" => $group["id"],
                "label" => isset($group["label"]) ? $group["label"] : "",
                "class" => $group["class"],
                "items" => []
            ];
            foreach($group["array-items"] as $item) {
                if(!$item["array-links"])
                    continue;

                $link = $item["array-links"][0];
                if(!$link)
                    continue;

                $portlet = [
                    "id" => $item["id"],
                    "class" => $item["class"],
                    "name" => $item["name"],
                    "text" => $link["text"],
                    "icon" => $link["icon"],
                ];
                foreach($link["array-attributes"] as $v)
                    $portlet[$v["key"]] = $v["value"];
                
                $result["items"][] = $portlet;
            }
            $results[substr($type, 5)] = $result;
        }
        return $results;
    }
}


class SkinTerritoiresWiki extends SkinMustache {
    
    public $template = 'skin';


    public function getTemplateData(): array {
        $data = parent::getTemplateData();
        $out = $this->getOutput();
        $out->enableOOUI();

        $vueData = (new ContextBuilder())->getContext($this, $data);

        // On injecte le résultat complet dans la configuration
        $out->addJsConfigVars( 'wgTerritoiresWikiData', $vueData );

        $data['html-bodytext'] = $out->getHTML(); 
        # $data['html-reporttime'] = $out->getBottomScripts() . $this->getContext()->getTiming()->getDebugHTML();
        
        $out->addModules( [ 'skins.territoireswiki.assets' ] );

        return $data;
    }
}
