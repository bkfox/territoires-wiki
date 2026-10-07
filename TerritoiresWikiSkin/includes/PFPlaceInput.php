<?php

require_once __DIR__ . '/PFWidgetInput.php';

class PFPlaceInput extends PFWidgetInput {

    public static function getName(): string {
        return 'place';
    }

    public static function getParameters(): array {
        $params = parent::getParameters();

        $params['coordinates'] = [
            'name' => 'coordinates',
            'type' => 'string',
            'description' =>
                'Name of the Page Forms field containing the coordinates.',
        ];

        $params['country'] = [
            'name' => 'country',
            'type' => 'string',
            'description' =>
                'Name of the Page Forms field containing the country.',
        ];

        return $params;
    }

    protected function getWidgetName(): string {
        return 'PlaceInput';
    }

    protected function getWidgetProps(): array {
        return [
            'coordinatesField' =>
                $this->mOtherArgs['coordinates'] ?? null,
            'countryField' =>
                $this->mOtherArgs['country'] ?? null,
            'addressField' => $this->mInputName,
        ];
    }
}
