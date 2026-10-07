<?php

require_once __DIR__ . '/PFWidgetInput.php';


class PFPlaceAddressInput extends PFWidgetInput {

    public static function getName(): string {
        return 'placeAddress';
    }

    public static function getParameters(): array {
        $params = parent::getParameters();

        $params['coordinates field'] = [
            'name' => 'coordinates field',
            'type' => 'string',
            'description' =>
                'Name of the Page Forms field containing the coordinates.',
        ];

        $params['country field'] = [
            'name' => 'country field',
            'type' => 'string',
            'description' =>
                'Name of the Page Forms field containing the country.',
        ];

        return $params;
    }

    protected function getWidgetName(): string {
        return 'pf-place-address-input';
    }

    protected function getWidgetProps(): array {
        return [
            'coordinatesField' =>
                $this->mOtherArgs['coordinates field'] ?? null,
            'countryField' =>
                $this->mOtherArgs['country field'] ?? null,
        ];
    }
}
