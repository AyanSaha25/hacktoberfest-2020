class WelcomeScreenStage extends Stage
{
    init() {
        this.initStage(this.game.getResource('bgOverview'));
        this.setHeadline(this.game.getString('hl_choose_level'), 35, 11, '#fff');

        this.btnPrev = new Button('btn-prev', '< ' + this.game.getString('previous_page'));
        this.btnNext = new Button('btn-next', this.game.getString('next_page') + ' >');

        this.pageLabel = new Label('label-page', this.game.getString('page'));
        this.pageLabel.hide();

        this
            .add(this.btnPrev, Stage.POS_MENUBAR, Button.LEFT)
            .add(this.pageLabel, Stage.POS_MENUBAR, Label.CENTER)
            .add(this.btnNext, Stage.POS_MENUBAR, Button.RIGHT);

        this.config = {
            padding: 15, // %
            grid: {
                space: 5 // %
            },
            startAnimation: {
                delay: 200,
                timeout: 20,
                headline: {
                    stop: 11,
                    steps: .5
                }
            }
        };

        this.grid = {
            rows: 3,
            cols: 2
        };

        this.pageNum = 0;

        this.startAnimationPercentage = 0;

        this.highlightedLevel = 0;

        this.welcomeTop = 30;

        this.intervals = {};

        window.setTimeout(() => {
            this.intervals.headlineAnimation = window.setInterval(() => {
                if (this.welcomeTop > this.config.startAnimation.headline.stop) {
                    this.welcomeTop -= this.config.startAnimation.headline.steps;

                    var startAnimationSteps = 50 - this.config.startAnimation.headline.stop;
                    var startAnimationCurrentSteps = this.welcomeTop - this.config.startAnimation.headline.stop;
                    this.startAnimationPercentage = 100 - (startAnimationCurrentSteps * 100 / startAnimationSteps);
                } else {
                    window.clearInterval(this.intervals.headlineAnimation);
                    delete this.intervals.headlineAnimation;
                    this.startAnimationPercentage = 100;
                }
            }, 20);
        }, this.config.startAnimation.delay);
    }

    start(parameters) {
        this.game.setAddressBarColor('#017e32');

        if ('undefined' != typeof parameters && 'undefined' != typeof parameters.fromLevel) {
            var boxesPerPage = this.grid.rows * this.grid.cols;
            var page = 0;

            for (var i = 0; i < this.game.images.length; i += boxesPerPage) {
                if (i >= parameters.fromLevel) {
                    break;
                }
                page++;
            }

            if (page > 0) {
                page --;
            }

            this.pageNum = page;
        }
    };

    paint() {
        var defaultX = this.config.padding  * this.ctx.canvas.width / 100;

        var width = this.ctx.canvas.width - (2 * defaultX);

        var boxSize = (width - this.config.grid.space) / this.grid.cols;

        var x = defaultX;
        var y = 15 * this.ctx.canvas.height / 100;

        this.ctx.save();
        // ctx.translate(0, (50 - stage.startAnimationPercentage));

        var maxPerPage = this.grid.cols * this.grid.rows;
        var start = this.pageNum * maxPerPage;
        var end = start + maxPerPage;
        if (end > this.game.images.length) {
            end = this.game.images.length;
        }

        var cnt = 0;
        for (var level = start + 1; level <= end; level++) {
            var img = this.game.images[level - 1];

            this.ctx.beginPath();
            this.ctx.rect(x, y, boxSize, boxSize);

            this.ctx.globalAlpha = this.startAnimationPercentage / 100;
            this.ctx.fillStyle = '#fff';

            var isAllowed = this.game.level >= level;

            if (this.ctx.isPointInPath(Observer.pointer.x, Observer.pointer.y)) {
                if (isAllowed) {
                    this.ctx.fillStyle = '#f00';
                    this.game.setCursor('welcome-game-' + level, 'pointer');
                    this.highlightedLevel = level;
                } else {
                    this.game.setCursor('welcome-game-' + level, 'not-allowed');
                    if (this.highlightedLevel == level) {
                        this.highlightedLevel = 0;
                    }
                }
            } else {
                this.game.resetCursor('welcome-game-' + level);
                if (this.highlightedLevel == level) {
                    this.highlightedLevel = 0;
                }
            }

            this.ctx.fillRect(x, y, boxSize, boxSize);
            this.ctx.closePath();

            this.ctx.drawImage(img, x + 5, y + 5, boxSize - 10, boxSize - 10);

            var showStars = false;
            if (!isAllowed) {
                this.ctx.save();
                this.ctx.globalAlpha = .6;
                this.ctx.fillStyle = '#efefef';
                this.ctx.fillRect(x, y, boxSize, boxSize);
                this.ctx.restore();
            } else {
                showStars = true;
            }

            if (showStars) {

                var starCnt = localStorage.getItem('stars-level-' + this.game.set + '-' + level);

                for (var i = 0; i < 3; i++) {

                    let starImage = this.game.getResource('star');

                    if (i + 1 > starCnt) {
                        starImage = this.game.getResource('starInactive');
                    }

                    var maxMultiplicator = .15;

                    if (this.highlightedLevel == level) {
                        maxMultiplicator = .17;
                    }

                    var multiplicator = this.startAnimationPercentage * maxMultiplicator / 100;

                    var starW = boxSize * multiplicator;
                    var starH = starW;
                    var starX = x + boxSize - (starW / 2);
                    var starY = y + boxSize - (starH / 2);

                    if (1 == i) {
                        starX -= starW * .8;
                    }

                    if (2 == i) {
                        starX -= (starW * .8) * 2;
                    }

                    this.ctx.save();
                    this.ctx.translate(-(starW / 2), -(starH / 2));
                    this.ctx.drawImage(starImage,
                        starX,
                        starY,
                        starW,
                        starH);
                    this.ctx.restore();
                }
            }

            cnt ++;

            if (cnt % this.grid.cols == 0) {
                x = defaultX;
                y += boxSize;
                y += this.config.grid.space;
            } else {
                x += boxSize;
                x += this.config.grid.space;
            }
        }

        var hasPages = (this.pageNum > 0 || end < this.game.images.length);

        if (this.pageNum > 0) {
            this.btnPrev.setVisible(true);
        } else {
            this.btnPrev.setVisible(false);
        }

        if (end < this.game.images.length) {
            this.btnNext.setVisible(true);
        } else {
            this.btnNext.setVisible(false);
        }

        if (hasPages) {
            var maxPage = Math.ceil(this.game.images.length / maxPerPage);
            // this.game.paintText(this.game.getString('page') + ' ' + (this.pageNum + 1) + ' / ' + maxPage, 'center');
            this.pageLabel
                .setPlaceholder(this.pageNum + 1, maxPage)
                .show();
        }

        this.ctx.restore();
    };

    buttonClick(name) {
        switch (name) {
            case 'btn-next':
                this.pageNum ++;
                break;
            case 'btn-prev':
                this.pageNum --;
                break;
        }
    };

    click(middle) {
        middle = middle || 0;
        if (this.highlightedLevel > 0) {
            var starCnt = localStorage.getItem('stars-level-' + this.game.set + '-' + this.highlightedLevel) || 0;

            this.game.setStage('game', {
                level: this.highlightedLevel,
                stars: starCnt
            });
        }
    };
}
