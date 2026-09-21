<?php

namespace MediaWiki\Extension\TerritoiresWiki;

use SkinTemplate;

final class Hooks
{
    public static function onSkinTemplateNavigationUniversal(
        SkinTemplate $skin,
        array &$links
    ): void {
        $title = $skin->getTitle();

        if (
            !$title->exists()
            || $title->isSpecialPage()
            || $title->getNamespace() < 0
        ) {
            return;
        }

        $browseTitle = \SpecialPage::getTitleFor(
            'Browse',
            $title->getPrefixedDBkey()
        );

        $links['views']['data'] = [
            'class' => '',
            'text' => wfMessage('territoireswiki-data')->text(),
            'href' => $browseTitle->getLocalURL(),
        ];
    }
}
