class GameLoaderStage extends Stage
{
    init() {
        this.config = {
            colors: {
                background: '#f00',
                bar: {
                    background: '#fff',
                    main: '#00f'
                }
            },
            paddingX: 10, // %
            height: 10,   // %
            barSpace: 10   // % from height
        };

        this.percentage = 0;

        // this.debug('loader', 'Loading background image');
    }

    start() {
        this.game.setAddressBarColor('#9c0007');

        if (this.game.config.random && this.game.config.images.length < 1) {
            for (let i = 0; i < this.game.config.cnt; i++) {
                this.game.config.images.push('https://picsum.photos/800/1200/?random&_=' + i);
            }
        } else {
            this.game.config.random = false;
        }

        this.game.loadImage('bg-loading', 'res/bg-loading.svg').then(obj => {
            // this.debug('background image loaded', image);

            var image = obj.img;

            this.initStage(image);
            this.setHeadline(this.game.getString('loading'), 35, 43);

            if (this.game.config.shuffle && this.game.config.images.length < 1) {
                for (var i = 0; i < this.game.config.cnt; i++) {
                    this.game.config.images.push('image-' + (i + 1) + '.jpg');
                }
            }

            var cntFilesToLoad = Object.keys(this.game.resources).length;
            cntFilesToLoad += this.game.config.images.length;

            var loader = this;

            var filesLoaded = 0;

            this.game.loadResources(this.game.resources, cntLoaded => {
                filesLoaded ++;
                this.percentage = Math.floor(filesLoaded * 100 / cntFilesToLoad);
            }).then(resources => {
                for (var name in resources) {
                    this.game.addResource(name, resources[name]);
                }

                this.loadGameTiles(() => {
                    filesLoaded ++;
                    loader.percentage = Math.floor(filesLoaded * 100 / cntFilesToLoad);

                    // this.game.debug('loader', 'loaded image ' + filesLoaded + '/' + cntFilesToLoad);

                    if (filesLoaded == cntFilesToLoad) {
                        // this.game.debug('loader', 'all images loaded, starting welcomeScreen');

                        if (this.game.config.shuffle) {
                            this.shuffleImage();
                        }

                        this.game.setStage('welcomeScreen');
                    }
                });
            });
        });
    }

    getRedirectUrl(url, callback)
    {
        var http = new XMLHttpRequest();
        http.open('HEAD', url);
        http.onreadystatechange = function() {
            if (this.readyState == this.DONE) {
                callback(this.responseURL);
            }
        };
        http.send();
    }

    loadGameTiles(cbStatus) {

        var imagesToLoad = this.game.config.images;

        for (let i in imagesToLoad) {
            var name = imagesToLoad[i];

            var url = null;
            if (!this.game.config.random) {
                if (name.split('://').length < 2) {
                    url = this.game.config.directory + '/' + name;
                } else {
                    url = name;
                }

                this.loadImage(name, url, cbStatus);

            } else {
                this.getRedirectUrl(name, url => {
                    this.game.config.images[i] = url;
                    this.loadImage(url, url, cbStatus);
                });
            }
        }
    }

    loadImage(name, url, cbStatus) {
        this.game.loadImage(name, url).then(obj => {
            var canvas = document.createElement('canvas'),
                oc = document.createElement('canvas'),
                octx = oc.getContext('2d');

            var width = 500;

            canvas.width = width; // destination canvas size
            canvas.height = canvas.width * obj.img.height / obj.img.width;

            var cur = {
                width: Math.floor(obj.img.width * 0.5),
                height: Math.floor(obj.img.height * 0.5)
            };

            oc.width = cur.width;
            oc.height = cur.height;

            octx.drawImage(obj.img, 0, 0, cur.width, cur.height);

            oc.imageURL = obj.img.src;

            let index = -1;
            for (var j in this.game.config.images) {
                if (this.game.config.images[j] == obj.name) {
                    index = j;
                    break;
                }
            }

            this.game.images[index] = oc;

            cbStatus();
        });
    }

    paint() {
        var paddingX = this.config.paddingX * this.ctx.canvas.width / 100;

        var width = this.ctx.canvas.width - (2 * paddingX);
        var height = this.config.height * this.ctx.canvas.height / 100;

        var x = paddingX;
        var y = (this.ctx.canvas.height / 2) - (height / 2);

        var barSpace = height * this.config.barSpace / 100;

        var barX = x + (barSpace);
        var barY = y + (barSpace);
        var barWidth = (width - (2 * barSpace));
        var barHeight = (height - (2 * barSpace));

        barWidth = barWidth * this.percentage / 100;

        this.ctx.save();
        this.ctx.fillStyle = this.config.colors.bar.background;
        this.ctx.fillRect(x, y, width, height);

        this.ctx.fillStyle = this.config.colors.bar.main;
        this.ctx.fillRect(barX, barY, barWidth, barHeight);
        this.ctx.restore();
    };

    shuffleImage() {
        var a = this.game.images;
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        this.game.images = a;
    }
}