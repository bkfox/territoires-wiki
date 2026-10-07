<?php

class PFHandledInput extends PFFormInput {

    public static function getName(): string {
        return 'handled';
    }

    public function getHtmlText(): string {
        return '<span class="pf-handled-input"></span>';
    }
}
