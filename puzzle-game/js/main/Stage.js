class Stage
{
    constructor(game, ctx) {
        this.game = game;
        this.ctx = ctx;

        this.backgroundImage = null;
        this.headline = null;

        this.initialized = false;

        this.hoverHeadline = false;

        this.elements = {
            default: [],
            menuBar:  {
                'left': [],
                'center': [],
                'right': []
            }
        };
    }

    startStage(parameters) {
        this.game.debug('Stage', 'starting stage', this.constructor.name, 'with parameters', parameters);

        if (!this.initialized) {
            this.init();
            this.initialized = true;
        }

        this.start(parameters);
    }

    on(action, event) {
        // can be overridden
    }

    init() {
        throw 'Stage must override start method!';
    }

    start() {
        throw 'Stage must override init method!';
    }

    paint() {
        throw 'Stage must override paint method!';
    }

    add(element, position = Stage.POS_DEFAULT, float = null) {
        let data = {};
        if (float) {
            data.float = float;
        }

        if (Stage.POS_MENUBAR == position && float) {
            this.elements[position][float].push({
                element: element,
                data: {
                    float: float
                }
            });
        } else {
            this.elements[position].push({
                element: element,
                data: data
            });
        }

        // element.on('hide', button => console.log('hide', element));

        return this;
    }

    /**
     * gets called by game-main.js when
     * click happens but no button is
     * hovered
     */
    click() {
        if (this.hoverHeadline) {
            if (null == this.lastHeadlineClick) {
                this.lastHeadlineClick = new Date();
                return;
            }

            let now = new Date();
            let diff = now.getTime() - this.lastHeadlineClick.getTime();

            if (diff < 500) {
                this.headlineDoubleClick();
            }

            this.lastHeadlineClick = null;
        } else {
            this.lastHeadlineClick = null;
        }
    }

    // to be overridden
    headlineDoubleClick() {

    }

    initStage(backgroundImage) {
        if ('undefined' != typeof backgroundImage) {
            // this.game.debug('Stage', 'set background image', backgroundImage);
            this.backgroundImage = backgroundImage;
        }
    }

    setHeadline(text, percentX, percentY, color) {
        // this.game.debug('Stage', 'set new headline', text, percentX, percentY, color);

        this.headline = {
            text: text,
            x: percentX,
            y: percentY,
            color: color
        };
    }

    paintAll() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.paintBackground();
        this.paintHeadline();
        this.paint();
        this.paintElements();
    }

    paintBackground() {
        if (null != this.backgroundImage) {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

            return true;
        }

        return false;
    }

    paintHeadline() {
        if (null != this.headline) {

            var color = this.headline.color;

            if ('undefined' == typeof color) {
                color = '#000';
            }

            this.ctx.fillStyle = color;

            var x = this.ctx.canvas.width * this.headline.x / 100;
            var y = this.ctx.canvas.height * this.headline.y / 100;

            var width = this.ctx.canvas.width - (2 * x);

            var fontSize = 30;
            var font = fontSize + 'px Arial';

            this.ctx.font = font;
            var size = this.ctx.measureText(this.headline.text);
            if (size.width < width) {
                while (size.width < width) {
                    fontSize ++;

                    var font = fontSize + 'px Arial';
                    this.ctx.font = font;
                    size = this.ctx.measureText(this.headline.text);
                }
            } else {
                while (size.width > width) {
                    fontSize --;

                    var font = fontSize + 'px Arial';
                    this.ctx.font = font;
                    size = this.ctx.measureText(this.headline.text);
                }
            }

            this.ctx.beginPath();
            this.ctx.fillText(this.headline.text, x, y);
            if (this.game.isPointInRect(Observer.pointer.x, Observer.pointer.y, x, y - fontSize, size.width, fontSize)) {
                this.hoverHeadline = true;
            } else {
                this.hoverHeadline = false;
            }
            this.ctx.closePath();
        }
    }

    paintElements() {
        // paint menuBar
        if ('undefined' != typeof this.elements.menuBar) {
            for (let float in this.elements.menuBar) {
                for (let i in this.elements.menuBar[float]) {
                    let elem = this.elements.menuBar[float][i];

                    if (elem.element.isVisible()) {
                        elem.element.float = float;
                        elem.element.paint(this.ctx, this.game);
                    }
                }
            }
        }
    }

    debug() {
        var args = [this.constructor.name];

        for (var i in arguments) {
            args.push(arguments[i]);
        }

        this.game.debug.apply(this.game, args);
    }


    paintButton(name, float, text, fadeDuration) {
        var posY = this.ctx.canvas.height;
        var percentWidth = 30;
        var percentHeight = 8;
        var marginX = (this.ctx.canvas.width * 15 / 100);

        if ('undefined' == typeof fadeDuration) {
            fadeDuration = 0;
        }

        var buttonWidth = (this.ctx.canvas.width - (2 * marginX)) * (percentWidth / 100) * 1.1;
        var buttonHeight = this.ctx.canvas.height * (percentHeight / 100) * 1.12;

        var posX = 0;
        posY -= (buttonHeight * 1.4);

        switch (float) {
            case 'left':
                posX = marginX;
                break;
            case 'center':
                posX = (this.ctx.canvas.width / 2) - (buttonWidth / 2);
                break;
            case 'right':
                posX = this.ctx.canvas.width - marginX - buttonWidth;
                break;
        }

        this.ctx.fillStyle = "rgba(0, 0, 200, 0)";
        this.ctx.save();

        this.ctx.beginPath();
        this.ctx.rect(posX, posY, buttonWidth, buttonHeight);

        var btnImg = null;
        if (this.isPointInRect(Observer.pointer.x, Observer.pointer.y, posX, posY, buttonWidth, buttonHeight)) {
            this.setCursor(name, 'pointer');
            this.hoverButton = name;
            btnImg = game.getResource('btnHover');
        } else {
            btnImg = btnImg = game.getResource('btn');
            this.resetCursor(name);
            if (name == this.hoverButton) {
                this.hoverButton = null;
            }
        }

        this.ctx.closePath();

        if (fadeDuration > 0) {
            if ('undefined' == typeof this.buttonFades[name]) {
                this.buttonFades[name] = {
                    start: new Date(),
                    duration: fadeDuration,
                    finished: false
                };
                this.ctx.globalAlpha = 0;
            } else if ('undefined' != typeof this.buttonFades[name] && !this.buttonFades[name].finished) {
                var fade = this.buttonFades[name];

                var now = new Date();
                var maxDuration = fade.duration;
                var duration = (now.getTime() - fade.start.getTime());

                if (duration >= maxDuration) {
                    this.buttonFades[name].finished = true;
                } else {
                    var percentage = Math.ceil(duration * 100 / maxDuration);

                    this.ctx.globalAlpha = percentage / 100;
                }
            }
        }

        this.ctx.drawImage(btnImg, posX, posY, buttonWidth, buttonHeight);

        var wantedTextWidth = buttonWidth * .6;

        var fontSize = 30;

        this.ctx.font = fontSize + 'px Arial';
        var size = this.ctx.measureText(text);

        if (size.width > wantedTextWidth) {
            while (size.width > wantedTextWidth * .8) {
                fontSize --;
                this.ctx.font = fontSize + 'px Arial';
                size = this.ctx.measureText(text);
            }
        } else {
            while (size.width < wantedTextWidth * .8) {
                fontSize ++;
                this.ctx.font = fontSize + 'px Arial';
                size = this.ctx.measureText(text);
            }
        }

        this.ctx.fillStyle = '#000';

        if (this.hoverButton == name) {
            this.ctx.font = 'bold ' + this.ctx.font;
        }

        var textX = (posX + (buttonWidth / 2)) - (size.width / 2);

        this.ctx.fillText(text, textX, posY + (buttonHeight / 2) + (fontSize / 3));
        this.ctx.restore();
    }
}

Stage.POS_DEFAULT = 'default';
Stage.POS_MENUBAR = 'menuBar';