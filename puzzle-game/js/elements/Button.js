class Button extends Element
{
    constructor(name, text, float)
    {
        super();

        this.name = name;
        this.text = text;
        this.float = float;

        return this;
    }

    paint(ctx, game)
    {
        var posY = ctx.canvas.height;
        var percentWidth = 30;
        var percentHeight = 8;
        var marginX = (ctx.canvas.width * 15 / 100);

        var buttonWidth = (ctx.canvas.width - (2 * marginX)) * (percentWidth / 100) * 1.1;
        var buttonHeight = ctx.canvas.height * (percentHeight / 100) * 1.12;

        var posX = 0;
        posY -= (buttonHeight * 1.4);

        switch (this.float) {
            case Button.LEFT:
                posX = marginX;
                break;
            case Button.CENTER:
                posX = (ctx.canvas.width / 2) - (buttonWidth / 2);
                break;
            case Button.RIGHT:
                posX = ctx.canvas.width - marginX - buttonWidth;
                break;
        }

        ctx.fillStyle = "rgba(0, 0, 200, 0)";
        ctx.save();

        ctx.beginPath();
        ctx.rect(posX, posY, buttonWidth, buttonHeight);

        var btnImg = null;
        if (game.isPointInRect(Observer.pointer.x, Observer.pointer.y, posX, posY, buttonWidth, buttonHeight)) {
            btnImg = this.enableHover(game);
        } else {
            btnImg = game.getResource('btn');
            game.resetCursor(this.name);
            if (this.name == game.hoverButton) {
                game.hoverButton = null;
            }
        }

        ctx.closePath();

        /*
        if (fadeDuration > 0) {
            if ('undefined' == typeof this.buttonFades[name]) {
                this.buttonFades[name] = {
                    start: new Date(),
                    duration: fadeDuration,
                    finished: false
                };
                console.log('create fade for ' + name)
                ctx.globalAlpha = 0;
            } else if ('undefined' != typeof this.buttonFades[name] && !this.buttonFades[name].finished) {
                var fade = this.buttonFades[name];

                var now = new Date();
                var maxDuration = fade.duration;
                var duration = (now.getTime() - fade.start.getTime());

                if (duration >= maxDuration) {
                    this.buttonFades[name].finished = true;
                } else {
                    var percentage = Math.ceil(duration * 100 / maxDuration);

                    ctx.globalAlpha = percentage / 100;
                }
            }
        }
        */

        ctx.drawImage(btnImg, posX, posY, buttonWidth, buttonHeight);

        var wantedTextWidth = buttonWidth * .6;

        var fontSize = 30;

        ctx.font = fontSize + 'px Arial';
        var size = ctx.measureText(this.text);

        if (size.width > wantedTextWidth) {
            while (size.width > wantedTextWidth * .8) {
                fontSize --;
                ctx.font = fontSize + 'px Arial';
                size = ctx.measureText(this.text);
            }
        } else {
            while (size.width < wantedTextWidth * .8) {
                fontSize ++;
                ctx.font = fontSize + 'px Arial';
                size = ctx.measureText(this.text);
            }
        }

        ctx.fillStyle = '#000';

        if (this.hoverButton == name) {
            ctx.font = 'bold ' + ctx.font;
        }

        var textX = (posX + (buttonWidth / 2)) - (size.width / 2);

        ctx.fillText(this.text, textX, posY + (buttonHeight / 2) + (fontSize / 3));
        ctx.restore();
    }
}