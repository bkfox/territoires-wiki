<?php

abstract class PFWidgetInput extends PFFormInput {

    /**
     * Return the widget name used by the frontend widget system.
     */
    abstract protected function getWidgetName(): string;

    /**
     * Return the props passed to the frontend widget.
     */
    protected function getWidgetProps(): array {
        return [];
    }

    public function getResourceModuleNames() {
        return [
            'skins.territoires.widgets',
        ];
    }

    public function getHtmlText(): string {
        $props = [
            'name' => $this->mInputName,
            'value' => $this->mCurrentValue,
            'disabled' => $this->mIsDisabled,
        ];

        $props = array_merge(
            $props,
            $this->getWidgetProps(),
        );

        return $this->renderWidget(
            $this->getWidgetName(),
            $props,
        );
    }

    protected function renderWidget(
        string $name,
        array $props,
    ): string {
        return \MediaWiki\Html\Html::element(
            'div',
            [
                'class' => 'territoires-widget',
                'data-widget' => $name,
                'data-props' => json_encode(
                    $props,
                    JSON_THROW_ON_ERROR,
                    512,
                ),
            ],
        );
    }
}
