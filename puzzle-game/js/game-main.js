class Game
{
    constructor(selector, conf) {
        this.config = {
            directory: 'images',
            set: null,                  // used as identifier in LocalStorage keys
            width: 800,
            height: 1200,
            images: [],
            backgroundColor: '#f00',
            random: false,
            shuffle: false,
            language: 'en',
            cnt: 12
        };

        this.resources = {
            star: {
                file: 'res/star.svg',
                image: null
            },
            starInactive: {
                file: 'res/star-inactive.svg',
                image: null
            },
            btn: {
                file: 'res/btn.svg',
                image: null
            },
            btnHover: {
                file: 'res/btnHover.svg',
                image: null
            },
            bgOverview: {
                file: 'res/bg-overview.svg',
                image: null
            },
            bgGame: {
                file: 'res/bg-game.svg',
                image: null
            },
            fullscreen: {
                file: 'res/fullscreen.svg',
                image: null
            },
            fullscreenClose: {
                file: 'res/fullscreen-close.svg',
                image: null
            }
        };

        this.strings = {
            en: {
                loading: 'Loading...',
                hl_choose_level: 'Levels',
                level: 'Level',
                levels: 'Levels',
                hide: 'Hide Image',
                show: 'Show Image',
                page: '%1 / %2',
                previous_page: 'Prev',
                next_page: 'Next',
                next_level: 'Next',
                play_again: 'Play Again'
            },
            de: {
                loading: 'Laden...',
                hl_choose_level: 'Levels',
                level: 'Level',
                levels: 'Levels',
                hide: 'verstecken',
                show: 'anzeigen',
                page: '%1 / %2',
                previous_page: 'Zurück',
                next_page: 'Vor',
                next_level: 'Nächstes Level',
                play_again: 'Erneut spielen'
            }
        };

        if ('undefined' != typeof conf) {
            for (var key in conf) {
                if ('undefined' != typeof this.config[key]) {
                    this.config[key] = conf[key];
                }
            }
        }

        this.images = [];

        this.set = this.config.set;

        this.level = localStorage.getItem('level-' + this.set) || 1;

        this.stages = {};
        this.currentStage = null;

        this.buttonFades = {};

        this.hoverButton = null;
        this.hoverFullscreen = false;

        this.ignoreTouchEnd = false;

        this.cursorSetBy = null;

        var element = document.querySelector(selector);

        if ('undefined' == typeof element) {
            throw 'Element not found: ' + selector;
        }

        var canvas = document.createElement('canvas');
        canvas.setAttribute('id', 'game');

        element.appendChild(canvas);

        this.ctx = canvas.getContext('2d');

        this.initStage('loader');
        this.initStage('welcomeScreen');
        this.initStage('game');

        this.setStage('loader');

        this.resize();

        this.registerEvents();

        requestAnimationFrame(function() {
            game.paint();
        });

        window.setInterval(function() {
            game.tick();
        }, 70);
    }

    getString(code) {
        var translations = this.strings[this.config.language];

        return ('undefined' != typeof translations[code] ? translations[code] : null);
    }

    paint() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.currentStage.paintAll();
        this.paintFullscreenIcon();

        requestAnimationFrame(() => {
            this.paint();
        });
    }

    paintFullscreenIcon() {
        var icon = this.getResource('fullscreen');

        if (icon) {
            var size = this.ctx.canvas.width * .05;
            var x = this.ctx.canvas.width - size * 2.5;
            var y = size * 1.4;

            this.ctx.save();
            this.ctx.fillStyle = "rgba(0, 0, 200, 0)";

            if (this.isPointInRect(Observer.pointer.x, Observer.pointer.y, x, y, size, size)) {
                this.setCursor('fullscreen', 'pointer');
                this.ctx.globalAlpha = 1;
                this.hoverFullscreen = true;
            } else {
                this.resetCursor('fullscreen', 'pointer');
                this.ctx.globalAlpha = .5;
                this.hoverFullscreen = false;
            }

            let image = (this.isFullscreen() ? this.resources.fullscreenClose.image : this.resources.fullscreen.image);

            this.ctx.drawImage(image, x, y, size, size);
            this.ctx.restore();
        }
    }

    tick() {
        if ('function' == typeof this.currentStage.tick) {
            this.currentStage.tick();
        }
    }

    resize() {
        var width = this.config.width;
        var height = this.config.height;

        if (window.innerHeight < height) {
            width = width * window.innerHeight / height;
            height = window.innerHeight;

            if (window.innerWidth < width) {
                width = window.innerWidth;
            }
        }

        this.ctx.canvas.width = width;
        this.ctx.canvas.height = height;
    }

    setStage(name, params) {
        if ('undefined' == this.stages[name]) {
            throw 'Unknown stage: ' + name;
        }

        this.currentStage = this.stages[name];

        this.currentStage.startStage(params);

        this.buttonFades = {};
        this.resetAllCursors();
    }

    setLevel(level, startLevel, stars) {
        if ('undefined' != this.images[this.level]) {
            if (level > this.level) {
                this.level ++;
            }

            if ('undefined' == typeof startLevel) {
                startLevel = true;
            }

            if (!startLevel && 'undefined' != typeof stars) {
                localStorage.setItem('stars-level-' + this.set + '-' + (level-1), stars);
            }

            localStorage.setItem('level-' + this.set, this.level);

            if (startLevel) {
                var stars = localStorage.getItem('stars-level-' + this.set + '-' + level) || 0;

                this.initStage('game');
                this.setStage('game', {
                    level: level,
                    stars: stars
                });
            }
        }
    }

    setCursor(setBy, cursor) {
        if (setBy != this.cursorSetBy) {
            this.ctx.canvas.style.cursor = cursor;
            this.cursorSetBy = setBy;
        }
    }

    resetCursor(setBy) {
        if (setBy == this.cursorSetBy) {
            this.cursorSetBy = null;
            this.ctx.canvas.style.cursor = null;
        }
    }

    resetAllCursors() {
        this.cursorSetBy = null;
        this.ctx.canvas.style.cursor = null;
    }

    initStage(name) {
        switch (name) {
            case 'loader':
                this.stages.loader = new GameLoaderStage(this, this.ctx);
                break;
            case 'welcomeScreen':
                this.stages.welcomeScreen = new WelcomeScreenStage(this, this.ctx);
                break;
            case 'game':
                this.stages.game = new GameStage(this, this.ctx);
                break;
        }
    }

    click() {
        if (null != game.hoverButton) {
            if ('function' == typeof game.currentStage.buttonClick) {
                game.currentStage.buttonClick(game.hoverButton);
            }
            game.hoverButton = null;
        } else if ('function' == typeof game.currentStage.click) {
            game.currentStage.click();
        }

        if (this.hoverFullscreen) {
            if (!this.isFullscreen()) {
                this.startFullscreen();
            } else {
                this.stopFullscreen();
            }
        }
    }

    startFullscreen() {
        if (document.body.requestFullscreen) {
            document.body.requestFullscreen();
        } else if (document.body.webkitRequestFullscreen) {
            document.body.webkitRequestFullscreen();
        } else if (document.body.mozRequestFullScreen) {
            document.body.mozRequestFullScreen();
        } else if (document.body.msRequestFullscreen) {
            document.body.msRequestFullscreen();
        }
        this.resetCursor('fullscreen', 'pointer');
    }

    stopFullscreen() {
        console.log('sthop fulll');
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.mozExitFullScreen) {
            document.mozExitFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
        this.resetCursor('fullscreen', 'pointer');
    }

    isFullscreen(){
        return document.fullscreenElement ||
            document.webkitFullscreenElement ||
            document.mozFullScreenElement ||
            document.msFullscreenElement;
    }

    middleClick() {
        if (null != game.hoverButton) {
            if ('function' == typeof game.currentStage.buttonClick) {
                game.currentStage.buttonClick(game.hoverButton, 1);
            }
            game.hoverButton = null;
            this.touchTimeout = null;
        } else if ('function' == typeof game.currentStage.click) {
            game.currentStage.click(1);
        }
    }

    isPointInRect(refX, refY, rectX, rectY, rectW, rectH) {
        return (
            (refX >= rectX && refX <= (rectX + rectW)) &&
            (refY >= rectY && refY <= (rectY + rectH))
        );
    }

    loadResource(name, url) {
        return new Promise((resolve, reject) => {
            var img = new Image;
            img.name = name;

            img.onload = () => {
                resolve(img);
            };

            img.onerror = () => {
                reject(img);
            };

            img.src = url;
        });
    }

    loadResources(objResources, cntCallback) {
        return new Promise((resolve, reject) => {
            var cntLoaded = 0;
            var images = {};
            for (var name in objResources) {
                var file = objResources[name].file;

                this.loadResource(name, file).then(image => {
                    cntLoaded ++;
                    images[image.name] = image;

                    cntCallback(cntLoaded);

                    if (cntLoaded == Object.keys(this.resources).length) {
                        resolve(images);
                    }
                });
            }
        });
    }

    loadImage(name, url) {
        return new Promise((resolve, reject) => {
            var img = new Image;

            img.onload = () => {
                resolve({
                    name: name,
                    url: url,
                    img: img
                });
            };

            img.onerror = () => {
                reject(img);
            };

            img.src = url;
        });
    }

    addResource(name, res) {
        if ('undefined' == typeof this.resources[name]) {
            throw 'Unknown resource: ' + name;
        }

        // this.debug('main', 'set resource', name, res);
        this.resources[name].image = res;
    }

    getResource(name) {
        return ('undefined' != typeof this.resources[name] ? this.resources[name].image : false);
    }

    debug(type, msg) {
        arguments[0] = 'debug (' + arguments[0] + '):';
        console.log(arguments);
    }

    registerEvents() {
        Observer.init(this);

        Observer
            .on('resize', () => {
                game.resize();
            })
            .on('click', () => {
                game.click();
            })
            .on('middleclick', () => {
                game.middleClick();
            })
            .on('touchend', e => {
                e.preventDefault();
                if (this.ignoreTouchEnd) {
                    this.ignoreTouchEnd = false;
                    return;
                }

                game.currentStage.paintAll();

                game.paintFullscreenIcon();
                game.click();
            })
            .onKey('s', e => {
                if ('function' == typeof this.currentStage.solve) {
                    this.currentStage.solve();
                }
            });
    }

    setAddressBarColor(color) {
        var metaTag = document.querySelector('meta[name=theme-color]');

        if (!metaTag) {
            metaTag = document.createElement('meta');
            metaTag.setAttribute('name', 'theme-color');

            document.head.appendChild(metaTag);
        }

        metaTag.setAttribute('content', color);
    }
}
