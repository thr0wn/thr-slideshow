angular
    .module('thr-slideshow')
    .service('thrSlideshow', class {
        constructor() {
            this.visible = false;
            this.photosList = [];
            this.photoIndex = 0;
        }
        show(photosList, index) {
            this.photosList = photosList;
            this.photoIndex = index || 0;
            this.visible = true;
        }
        hide() {
            this.visible = false;
            this.photosList = [];
            this.photoIndex = 0;
        }
    });