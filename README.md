# thr-slideshow

This directive exposes a basic slideshow as AngularJS 1.x module.

## Installation

1. Be sure that `AngulsJS 1.x`, `Bootstrap 3` (css only), and `jQuery` are imported.
2. Set `thr-slideshow` as a dependencie of your AngularJS module.
3. Add a script tag pointing to `dist/thr-slideshow.min.js` or `dist/thr-slideshow.js` and a link tag pointing `dist/thr-slideshow.min.css` or `dist/thr-slideshow.css` to your index.html.

## Usage

After placing thr-slideshow in any place of the <body>, some controller must inject thrSlideshow and call thrSlideshow.show with the appropriate parameters, e.g:
```html
<body>
    ...
    <thr-slideshow></thr-slideshow>
    ...
</body>
```
```javascript
angular
    .module('anyModuleName', ['thr-slideshow'])
    .controller('anyControllerName', [
        '$scope', 'thrSlideshow',
        function ($scope, thrSlideshow) {
            $scope.openSlideShow = function () {
                thrSlideshow.show([
                    { path: 'path/to/your/image/1'},
                    { path: 'path/to/your/image/2', description: 'Optional description' },
                    { path: 'path/to/your/image/3' }
                ]);
            };
        }
    ]);
```
An example can be found in https://thr0wn.github.io/thr-slideshow/ 
