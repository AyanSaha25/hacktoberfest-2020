class GameStage extends Stage
{
    init() {
        this.initStage(this.game.getResource('bgGame'));

        this.config = {
            paddingX: 13, // %
            paddingY: 15, // %
            winAnimation: {
                duration: 2000 // ms
            },
            imageBorder: {
                width: 2, // px
                color: '#fff'
            }
        };

        /**
         * Maximum time to solve the latest level
         * time gets calculated by percentage which level this is
         * if used time < 33% -> 3 stars
         * if used time < 66% -> 2 stars
         *
         * @type {number}
         */
        this.maxTime = 90;
        this.useMaxTime;

        this.winAnimationStart = null;
        this.showWinSymbol = false;

        this.level = 0;

        this.min = {
            cols: 3,
            rows: 4
        };

        this.max = {
            rows: 6,
            cols: 5
        };

        this.chunks = [];
        this.sort = [];

        this.hoveredChunk = -1;
        this.hightlightedChunk = -1;

        this.maxWinSymbols = 3;
        this.winSymbolCount = 0;

        this.fullImage = null;
        this.showImage = false;

        this.fromWin = false;
        this.success = false;

        this.dateStart = null;
        this.runTime = null;
        this.running = false;

        this.btn = {};

        this.btn.back = new Button('btn-back', '< ' + this.game.getString('levels'));
        this.btn.hide = new Button('btn-hide', this.game.getString('hide'));
        this.btn.show = new Button('btn-show', this.game.getString('show'));
        this.btn.again = new Button('btn-again', this.game.getString('play_again'));
        this.btn.next = new Button('btn-next', this.game.getString('next_level') + ' >');

        this.btn.hide.hide();
        this.btn.show.hide();
        this.btn.again.hide();

        this
            .add(this.btn.back, Stage.POS_MENUBAR, Button.LEFT)
            .add(this.btn.hide, Stage.POS_MENUBAR, Button.CENTER)
            .add(this.btn.show, Stage.POS_MENUBAR, Button.CENTER)
            .add(this.btn.again, Stage.POS_MENUBAR, Button.CENTER)
            .add(this.btn.next, Stage.POS_MENUBAR, Button.RIGHT);

        Observer.onKey('s', () => {
            if (this.btn.show.isVisible()) {
                this.solve()
            }
        });

        Observer.onKeyCode(Observer.KEY_RIGHT, () => {
            if (this.btn.next.isVisible()) {
                this.buttonClick('btn-next');
            }
        });
    }

    start(parameters) {
        this.game.setAddressBarColor('#002a7a');

        if ('undefined' != typeof parameters.level) {

            var percentage = Math.ceil(parameters.level * 100 / this.game.images.length);

            this.chunksPerRowX = Math.ceil(this.max.cols * (percentage / 100));
            this.chunksPerRowY = Math.ceil(this.max.rows * (percentage / 100));

            if (this.chunksPerRowX < this.min.cols) {
                this.chunksPerRowX = this.min.cols;
            }

            if (this.chunksPerRowY < this.min.rows) {
                this.chunksPerRowY = this.min.rows;
            }

            this.level = parameters.level;

            this.setHeadline(this.game.getString('level') + ' ' + this.level, 35, 11, '#fff');

            this.chunks = [];
            this.success = false;

            var image = this.game.images[this.level - 1];

            var gridX = this.config.paddingX * this.ctx.canvas.width / 100;
            var gridY = this.config.paddingY * this.ctx.canvas.height / 100;

            var gridWidth = this.ctx.canvas.width - (2 * gridX);
            var gridHeight = (this.ctx.canvas.height * .9) - (2 * gridY);

            var newCanvas = document.createElement('canvas');
            var newCanvasCtx = newCanvas.getContext('2d');

            var newWidth = 500;
            var newHeight = 750;

            var clipHeight = Math.ceil(newHeight * image.width / newWidth);

            if (clipHeight > newHeight) {
                clipHeight = newHeight;
            }

            newCanvas.width = newWidth;
            newCanvas.height = newHeight;
            newCanvasCtx.drawImage(image, 0, 0, image.width, image.height, 0, 0, newWidth, newHeight);

            this.fullImage = newCanvas;

            var chunkSizeX = newWidth / this.chunksPerRowX;
            var chunkSizeY = newHeight / this.chunksPerRowY;

            var displaySizeX = gridWidth / this.chunksPerRowX;
            var displaySizeY = gridHeight / this.chunksPerRowY;

            var currentX = gridX;
            var currentY = gridY;

            var nthX = 0;
            var nthY = 0;

            for (var y = 0; y < this.chunksPerRowY; y ++) {
                nthX = 0;

                for (var x = 0; x < this.chunksPerRowX; x ++) {
                    var nc = document.createElement('canvas');
                    var ncx = nc.getContext('2d');

                    nc.width = displaySizeX;
                    nc.height = displaySizeY;

                    ncx.drawImage(newCanvas, chunkSizeX * nthX, chunkSizeY * nthY, chunkSizeX, chunkSizeY, 0, 0, displaySizeX, displaySizeY);

                    this.chunks.push({
                        image: nc,
                        correct: false
                    });

                    currentX += displaySizeX;

                    nthX ++;
                }

                currentX = gridX;
                currentY += displaySizeY;
                nthY ++;
            }

            var levelCount = this.game.images.length;
            var levelPercent = Math.floor(this.level * 60 / levelCount) + 40;

            this.useMaxTime = this.maxTime * levelPercent / 100;

            this.success = this.game.level > parameters.level;

            if (!this.success) {
                this.running = true;
                this.dateStart = new Date();
            }

            this.winSymbolCount = parameters.stars;

            this.prepareSort();
        } else {
            throw 'current level is not defined';
        }

        this.setButtonState();
    }

    tick() {
    }

    setButtonState() {
        this.btn.next.setVisible(this.hasNextLevel() && this.isNextLevelAllowed());
        this.btn.again.setVisible(this.success);
        this.btn.show.setVisible(!this.showImage);
        this.btn.hide.setVisible(this.showImage);
    }

    paint() {
        var runTime = this.getRunTime();

        var gridX = this.config.paddingX * this.ctx.canvas.width / 100;
        var gridY = this.config.paddingY * this.ctx.canvas.height / 100;

        if (runTime) {
            var fontSize = this.ctx.canvas.width * 0.03;

            var text = runTime.print + ' (max: ' + this.formatTime(this.useMaxTime) + ', stars: ' + this.getNumberOfStars(this.runTime.seconds) + ')';

            this.ctx.save();
            this.ctx.fillStyle = '#fff';
            this.ctx.font = fontSize + 'px Arial';
            this.ctx.fillText(text, gridX, gridY - 10);
            this.ctx.restore();

            if (this.success) {
                this.dateStart = null;
                this.running = false;
            }
        }

        var gridWidth = this.ctx.canvas.width - (2 * gridX);
        var gridHeight = (this.ctx.canvas.height) - (2 * gridY);

        let borderWidth = this.config.imageBorder.width;
        this.ctx.fillStyle = this.config.imageBorder.color;

        let bgX = gridX - borderWidth;
        let bgY = gridY - borderWidth;

        this.ctx.fillRect(bgX, bgY, gridWidth + (borderWidth * borderWidth), gridHeight + (borderWidth * borderWidth));

        if (!this.success) {
            var chunkSizeX = gridWidth / this.chunksPerRowX;
            var chunkSizeY = gridHeight / this.chunksPerRowY;

            var nthX = 0;
            var nthY = 0;

            var currentX = gridX + this.config.imageBorder.width;
            var currentY = gridY + this.config.imageBorder.width;

            var i = 0;
            if (this.chunks.length > 0) {

                for (var y = 0; y < this.chunksPerRowY; y ++) {
                    nthX = 0;

                    for (var x = 0; x < this.chunksPerRowX; x ++) {

                        if ('undefined' == typeof this.chunks[i] || 'undefined' == typeof this.chunks[i].image) {
                            continue;
                        }

                        var imageNum = this.sort[i];
                        var chunk = this.chunks[imageNum];

                        var rectX = gridX + (chunkSizeX * nthX) - 1;
                        var rectY = gridY + (chunkSizeY * nthY) -1;
                        var rectW = chunkSizeX + 1;
                        var rectH = chunkSizeY + 1;

                        this.ctx.fillStyle = '#aeaeae';
                        if (this.game.isPointInRect(Observer.pointer.x, Observer.pointer.y, rectX, rectY, rectW, rectH)) {
                            if (!chunk.correct) {
                                if (!Observer.touchControll) {
                                    this.ctx.fillStyle = '#0f0';
                                }
                                this.hoveredChunk = i;

                                this.game.setCursor('chunk-' + x + '-' + y, 'pointer');
                            }
                        } else if (this.hoveredChunk == i) {
                            this.hoveredChunk = -1;
                            this.game.resetCursor('chunk-' + x + '-' + y);
                        }

                        if (this.hightlightedChunk == i) {
                            this.ctx.fillStyle = '#f00';
                        }

                        this.ctx.fillRect(gridX + (chunkSizeX * nthX) -1, gridY + (chunkSizeY * nthY) -1, chunkSizeX + 1, chunkSizeY + 1);

                        var chunkX = gridX + (chunkSizeX * nthX);
                        var chunkY = gridY + (chunkSizeY * nthY);
                        var chunkWidth = chunkSizeX;
                        var chunkHeight = chunkSizeY;

                        if (!this.chunks[i].correct) {
                            chunkX += 5;
                            chunkY += 5;
                            chunkWidth -= 10;
                            chunkHeight -= 10;
                        }

                        this.ctx.drawImage(chunk.image, chunkX, chunkY, chunkWidth, chunkHeight);

                        currentX += chunkSizeX;

                        nthX ++;
                        i ++;
                    }

                    currentX = gridX;
                    currentY += chunkSizeY;

                    nthY ++;
                }

                // preview
                if (this.showImage) {
                    this.ctx.drawImage(this.fullImage, bgX + borderWidth, bgY + borderWidth, gridWidth, gridHeight);
                }
            }

        } else {
            // finished level
            this.ctx.drawImage(this.fullImage, bgX + borderWidth, bgY + borderWidth, gridWidth, gridHeight);

            this.btn.again.setVisible(true);

            if (this.level < this.game.images.length && this.showWinSymbol) {
                this.btn.next.show();
            }
        }

        this.paintWinAnimation();
    }

    hasNextLevel() {
        return this.level < this.game.images.length;
    }

    isNextLevelAllowed() {
        return (this.level < parseInt(this.game.level));
    }

    buttonClick(name) {
        switch (name) {
            case 'btn-back':
                this.showImage = false;
                this.showWinSymbol = false;

                this.game.setStage('welcomeScreen', {
                    fromLevel: this.level
                });
                break;
            case 'btn-show':
                this.showImage = true;
                break;
            case 'btn-hide':
                this.showImage = false;
                break;
            case 'btn-next':
                this.game.setLevel(this.level + 1);
                break;
            case 'btn-again':
                this.showWinSymbol = false;
                this.success = false;

                this.dateStart = new Date();
                this.running = true;

                for (var i in this.chunks) {
                    this.chunks[i].correct = false;
                }

                this.prepareSort();
                break;
        }

        this.setButtonState();
    }

    click() {
        super.click();

        if (this.hoveredChunk >= 0) {
            if (this.hightlightedChunk != this.hoveredChunk) {
                if (this.hightlightedChunk < 0) {
                    this.hightlightedChunk = this.hoveredChunk;
                } else {
                    this.swap(this.hightlightedChunk, this.hoveredChunk);
                }
            } else {
                this.hightlightedChunk = -1;
            }
        }
    }

    headlineDoubleClick() {
        this.solve();
    }

    solve() {
        while (!this.success) {
            for (var i in this.sort) {
                var j = this.sort[i];
                this.swap(i, j);
            }
        }
    }

    help() {
        for (var i in this.sort) {
            var j = this.sort[i];
            this.swap(i, j);
            return;
        }
    }

    swap(i1, i2) {
        var image1 = this.sort[i1];
        var image2 = this.sort[i2];

        this.sort[i1] = image2;
        this.sort[i2] = image1;

        if (i1 == this.sort[i1]) {
            this.chunks[i1].correct = true;
            this.hoveredChunk = -1;
            this.game.resetAllCursors();
        }

        if (i2 == this.sort[i2]) {
            this.chunks[i2].correct = true;
            this.hoveredChunk = -1;
            this.game.resetAllCursors();
        }

        this.hightlightedChunk = -1;

        var allCorrect = true;
        for (var i in this.chunks) {
            if (!this.chunks[i].correct) {
                allCorrect = false;
                break;
            }
        }

        if (allCorrect) {
            this.success = true;

            this.startWinAnimation();

            this.game.setLevel(this.level + 1, false, this.winSymbolCount);
            this.game.resetAllCursors();
            this.hoveredChunk = -1;
        }

        this.setButtonState();
    }

    paintWinAnimation() {
        if (this.running) {
            return;
        }

        for (var i = 0; i < this.maxWinSymbols; i++) {

            var isSuccess = true;
            var img = this.game.getResource('star');

            if (i + 1 > this.winSymbolCount) {
                isSuccess = false;
                img = this.game.getResource('starInactive');
            }

            var gridX = this.config.paddingX * this.ctx.canvas.width / 100;
            var gridY = this.config.paddingY * this.ctx.canvas.height / 100;

            var gridWidth = this.ctx.canvas.width - (2 * gridX);
            var gridHeight = (this.ctx.canvas.height) - (2 * gridY);

            var showStar = false;

            var starSize = this.ctx.canvas.width * .1;

            var centerX = this.ctx.canvas.width / 2;
            var centerY = this.ctx.canvas.height / 2;

            var starX = gridX + gridWidth - starSize / 2;
            var starY = gridY + gridHeight - starSize / 2;

            if (1 == i) {
                starX -= starSize * .8;
            }

            if (2 == i) {
                starX -= (starSize * .8) * 2;
            }

            var inAnimation = false;

            if (null != this.winAnimationStart) {
                inAnimation = true;

                if (isSuccess) {
                    var now = new Date();
                    var msDuration = (now.getTime() - this.winAnimationStart.getTime());

                    var percentage = Math.ceil(msDuration * 100 / this.config.winAnimation.duration);

                    this.setAddressBarColorByPercent(percentage);

                    if (msDuration >= this.config.winAnimation.duration) {
                        this.winAnimationStart = null;
                    } else {
                        this.showWinSymbol = true;
                        this.fromWin = true;

                        starSize = gridWidth;
                        starSize = starSize * percentage / 100;

                        if (percentage >= 50) {
                            starSize -= (gridWidth);
                        }

                        starX = centerX;
                        starY = centerY;

                        if (1 == i) {
                            starX -= starSize / 2;
                        }

                        if (2 == i) {
                            starX += starSize / 2;
                        }
                    }
                }
            }

            if (this.showWinSymbol) {

                if ((!inAnimation && !isSuccess) || (isSuccess)) {
                    var half = starSize / 2;

                    this.ctx.save();
                    this.ctx.translate(starX, starY);
                    this.ctx.rotate(360 - (360 * percentage / 100));
                    this.ctx.translate(-half, -half);
                    this.ctx.drawImage(img, 0, 0, starSize, starSize);
                    this.ctx.restore();
                }
            }
        }
    }

    startWinAnimation() {
        this.winSymbolCount = this.getNumberOfStars(this.runTime.seconds);
        this.winAnimationStart = new Date();
    }

    on(action, event) {
        this.debug(action);
    }

    prepareSort(shuffle) {
        shuffle = !this.success;

        if (shuffle) {
            var arr = [];
            for (var i = 0; i < this.chunks.length; i++) {
                arr.push(i);
            }

            this.sort = arr.sort(function () {
                return 0.5 - Math.random()
            });

            for (var i in this.sort) {
                if (i == this.sort[i]) {
                    var newPos = -1;
                    while (newPos < 1 || i == newPos) {
                        newPos = Math.floor(Math.random() * arr.length);
                    }

                    var cache = this.sort[newPos];
                    this.sort[newPos] = this.sort[i];
                    this.sort[i] = cache;
                }
            }
        } else {
            for (var i in this.chunks) {
                this.sort[i] = i;
            }
            this.success = true;
            this.showWinSymbol = true;
        }
    }

    getRunTime() {
        if (this.running && this.dateStart) {
            var now = new Date();
            var runTime = Math.floor((now.getTime() - this.dateStart.getTime()) / 1000);

            this.runTime = {
                seconds: runTime,
                print: this.formatTime(runTime)
            };

            return this.runTime;

        } else if (!this.running && this.runTime) {
            return this.runTime;
        }

        return false;
    }

    getNumberOfStars(usedTime) {
        var runtimePercent = Math.floor(usedTime * 100 / this.useMaxTime);

        var stars = 1;
        if (runtimePercent < 66) {
            stars = 2;
        }
        if (runtimePercent < 33) {
            stars = 3;
        }

        return stars;
    }

    formatTime(seconds) {
        var min = '' + Math.floor(seconds / 60);
        var sec = '' + Math.floor(seconds % 60);

        if (min.length < 2) {
            min = '0' + min;
        }

        if (sec.length < 2) {
            sec = '0' + sec;
        }

        return min + ':' + sec;
    }

    setAddressBarColorByPercent(percentage) {

        let from = [0, 42, 122];
        let to = [235, 238, 4];

        if (percentage > 50) {
            percentage = 100 - percentage;
        }

        percentage *= 2;

        if (percentage < 0) {
            percentage = 0;
        }

        if (percentage > 100) {
            percentage = 100;
        }

        let rgbDiff = [];
        let rgbActualDiff = [];
        let actualColor = [];
        let actualColorHex = '#';

        for (let i in from) {
            rgbDiff[i] = to[i] - from[i];
        }
        for (let i in rgbDiff) {
            rgbActualDiff[i] = rgbDiff[i] * percentage / 100;
        }
        for (let i in rgbActualDiff) {
            actualColor[i] = Math.ceil(from[i] + rgbActualDiff[i]);
        }
        for (let i in actualColor) {
            let hex = actualColor[i].toString(16);
            if (hex.length < 2) {
                hex = '0' + hex;
            }
            actualColorHex += hex;
        }

        this.game.setAddressBarColor(actualColorHex);
    }
}