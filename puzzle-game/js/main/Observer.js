class Observer
{
    static init(game) {
        if (!game instanceof Game) {
            throw 'invalid class provided (should be Game, is: "' + game.constructor.name + '")'
        }

        Observer.KEY_LEFT = 73;
        Observer.KEY_UP = 38;
        Observer.KEY_RIGHT = 39;
        Observer.KEY_DOWN = 40;

        Observer.longTouchTimeout = null;

        Observer.game = game;

        Observer.actions = [];
        Observer.last = [];

        Observer.touchControll = false;

        Observer.callbacks = {};

        Observer.pointer = {
            x: 0,
            y: 0
        };

        Observer.registerAction('mousemove');
        Observer.registerAction('touchstart');
        Observer.registerAction('touchend');
        Observer.registerAction('middleclick');
        Observer.registerAction('mouseup');
    }

    static fire(action, event) {
        Observer.last[action] = (new Date().getTime());

        Observer.runInternalEvents(action, event);

        if ('undefined' != typeof Observer.callbacks[action]) {
            for (let i in Observer.callbacks[action]) {
                Observer.callbacks[action][i](event);
            }
        }
    }

    static on(action, callback) {
        if ('function' != typeof callback) {
            throw 'not a valid callback';
        }

        if (this.actions.indexOf(action) < 0) {
            Observer.registerAction(action);
        }

        if ('undefined' == typeof Observer.callbacks[action]) {
            Observer.callbacks[action] = [];
        }

        Observer.callbacks[action].push(callback);

        return Observer;
    }

    static onKey(char, callback) {
        if (this.actions.indexOf("keyup") < 0) {
            Observer.registerAction("keyup");
        }

        let keyCode = char.toUpperCase().charCodeAt(0);
        let action = 'key-' + keyCode;

        if ('undefined' == typeof Observer.callbacks[action]) {
            Observer.callbacks[action] = [];
        }

        Observer.callbacks[action].push(callback);

        return Observer;
    }

    static onKeyCode(keyCode, callback) {
        if (this.actions.indexOf("keyup") < 0) {
            Observer.registerAction("keyup");
        }

        let action = 'key-' + keyCode;

        if ('undefined' == typeof Observer.callbacks[action]) {
            Observer.callbacks[action] = [];
        }

        Observer.callbacks[action].push(callback);

        return Observer;
    }

    static registerAction(action) {
        Observer.actions.push(action);

        window.addEventListener(action, (e) => {
            Observer.fire(action, e);
        });
    }

    static lastAction(action) {
        return ('undefined' != Observer.last[action] ? Observer.last[action] : false);
    }

    static runInternalEvents(action, event) {
        switch (action) {
            case 'mousemove':
                Observer.touchControll = false;

                Observer.pointer = {
                    x: event.layerX,
                    y: event.layerY
                };

                if (Observer.longTouchTimeout) {
                    window.clearTimeout(Observer.longTouchTimeout);
                    Observer.longTouchTimeout = null;
                }
                break;

            case 'touchstart':
                Observer.touchControll = true;

                Observer.pointer = {
                    x: event.changedTouches[0].clientX - Observer.game.ctx.canvas.offsetLeft,
                    y: event.changedTouches[0].clientY - Observer.game.ctx.canvas.offsetTop
                };

                Observer.longTouchTimeout = window.setTimeout(() => {
                    window.clearTimeout(Observer.longTouchTimeout);
                    Observer.longTouchTimeout = null;

                    Observer.fire('middleclick', event);
                }, 500);
                break;

            case 'touchend':
                Observer.touchControll = true;

                Observer.pointer = {
                    x: event.changedTouches[0].clientX - Observer.game.ctx.canvas.offsetLeft,
                    y: event.changedTouches[0].clientY - Observer.game.ctx.canvas.offsetTop
                };

                if (Observer.longTouchTimeout) {
                    console.log('clear timeout');
                    window.clearTimeout(Observer.longTouchTimeout);
                    Observer.longTouchTimeout = null;
                } else {
                    Observer.fire('click', event);
                }
                break;

            case 'keyup':
                Observer.fire('key-' + event.keyCode);
                break;

            case 'mouseup':
                if (2 == event.which) {
                    return Observer.fire('middleclick', event);
                }
        }
    }
}