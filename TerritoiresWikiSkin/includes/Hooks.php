<?php

namespace MediaWiki\Skins\Territoires;

class Hooks {
    public static function onPageFormsFormPrinterSetup(&$formPrinter): void {
        $formPrinter->registerInputType( 'PFPlaceInput' );
        $formPrinter->registerInputType( 'PFHandledInput' );
        $formPrinter->registerInputType( 'PFPlaceAddressInput' );
        $formPrinter->registerInputType( 'PFPlaceCoordinatesInput' );
    }
}

