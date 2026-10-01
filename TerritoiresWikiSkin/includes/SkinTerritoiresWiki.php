<?php

use MediaWiki\Skin\SkinMustache;

class SkinTerritoiresWiki extends SkinMustache {
    /**
     * Cette méthode prépare les données qui seront injectées dans le fichier Mustache.
     */
    public function getTemplateData(): array {
        $data = parent::getTemplateData();
        $out = $this->getOutput();
        $title = $this->getSkin()->getTitle();
        $out->addModules( [ 'skins.territoireswiki.assets' ] );

        // custom context variables:
        // $data['custom_footer_text'] = "Propulsé fièrement par Vue & Vuetify";
        $data['html-title'] = $out->getTitle();
        $data['html-bodytext'] = $out->getHTML();

        $vueData = [
            'siteName'   => $this->getContext()->getConfig()->get( 'Sitename' ),
            'pageTitle'  => $title->getPrefixedText(), // Titre textuel propre de la page
            'isMainPage' => $title->isMainPage(),
            'categories' => [],
            'indicators' => []
        ];

        $categories = $out->getCategories();
        foreach ( $categories as $categoryName ) {
            // Nettoie le nom de la catégorie pour enlever les underscores et espaces superflus
            $vueData['categories'][] = str_replace( '_', ' ', $categoryName );
        }

        foreach ( $out->getIndicators() as $id => $htmlContent ) {
            $vueData['indicators'][] = [
                'id' => $id,
                'text' => strip_tags( $htmlContent ) // Nettoie le HTML pour ne garder que la valeur brute
            ];
        }

        $out->addJsConfigVars( 'wgTerritoiresWikiData', $vueData );
        return $data;
    }
}

