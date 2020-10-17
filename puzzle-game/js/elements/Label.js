class Label extends Element
{
    constructor(name, text)
    {
        super();

        this.name = name;
        this.text = text;

        this.placeholders = [];

        return this;
    }

    setPlaceholder(...vars) {
        this.placeholders = vars;

        return this;
    }

    getText() {
        var text = this.text;

        if (this.placeholders.length > 0) {
            for (var i in this.placeholders) {
                var num = (parseInt(i)+1);
                text = text.split('%' + num).join(this.placeholders[i]);
            }
        }

        return text;
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
            case 'left':
                posX = marginX;
                break;
            case 'center':
                posX = (ctx.canvas.width / 2) - (buttonWidth / 2);
                break;
            case 'right':
                posX = ctx.canvas.width - marginX - buttonWidth;
                break;
        }

        ctx.save();
        ctx.beginPath();

        var wantedTextWidth = buttonWidth * .6;

        var fontSize = 30;
        var text = this.getText();

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

        var textX = (posX + (buttonWidth / 2)) - (size.width / 2);
        var textY = posY + (buttonHeight / 2) + (fontSize / 3);

        ctx.fillStyle = '#000';
        ctx.fillText(text, textX, textY);

        ctx.closePath();
        ctx.restore();
    }
}