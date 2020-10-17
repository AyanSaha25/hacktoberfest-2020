class Element {
    constructor() {
        this._visible = true;

        this.callbacks = {
            'show': [],
            'hide': [],
            'input': []
        };

        this.hasHover = false;

        return this;
    }

    enableHover(game) {
        this.hasHover = true;
        game.setCursor(this.name, 'pointer');
        game.hoverButton = this.name;
        return game.getResource('btnHover');
    }

    disableHover(game) {
        this.hasHover = false;

    }

    setVisible(visible) {
        if (this._visible != visible) {
            this._visible = visible;

            if (visible) {
                this.triggerCallback('show');
            } else {
                this.triggerCallback('hide');
            }
        }

        return this;
    }

    show() {
        return this.setVisible(true);
    }

    hide() {
        return this.setVisible(false);
    }

    isVisible() {
        return this._visible;
    }

    on(action, callback) {
        if ('undefined' == typeof this.callbacks[action]) {
            throw 'unknown callback "' + callback + '"';
        }

        this.callbacks[action].push(callback);

        return this;
    }

    triggerCallback(action) {
        if ('undefined' == typeof this.callbacks[action]) {
            throw 'unknown action "' + action + '"';
        }

        for (let i in this.callbacks[action]) {
            this.callbacks[action][i](this);
        }
    }
}

Element.LEFT = 'left';
Element.CENTER = 'center';
Element.RIGHT = 'right';