<?php

require_once __DIR__ . '/PFWidgetInput.php';


class PFPlaceCoordinatesInput extends PFWidgetInput {

    public static function getName(): string {
        return 'placeCoordinates';
    }

    public static function getHandledPropertyTypes(): array {
        return [
            'Coordinates',
        ];
    }

    public static function getParameters(): array {
        $params = parent::getParameters();

        $params['address field'] = [
            'name' => 'address field',
            'type' => 'string',
            'description' =>
                'Name of the Page Forms field containing the address.',
        ];

        $params['height'] = [
            'name' => 'height',
            'type' => 'string',
            'description' =>
                'Height of the map.',
        ];

        $params['zoom'] = [
            'name' => 'zoom',
            'type' => 'integer',
            'description' =>
                'Initial map zoom level.',
        ];

        return $params;
    }

    protected function getWidgetName(): string {
        return 'pf-place-coordinates-input';
    }

    protected function getWidgetProps(): array {
        return [
            'addressField' =>
                $this->mOtherArgs['address field'] ?? null,
            'height' =>
                $this->mOtherArgs['height'] ?? 400,
            'zoom' =>
                $this->mOtherArgs['zoom'] ?? 13,
        ];
    }
}
