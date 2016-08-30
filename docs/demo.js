angular
    .module('demo-app', ['thr-slideshow'])
    .controller('DemoCtrl', [
        '$scope', 'thrSlideshow',
        function ($scope, thrSlideshow) {
            $scope.openSlideShow = function () {
                thrSlideshow.show([
                    { path: 'images/coffe.jpg'},
                    { path: 'images/aston_martin.jpg', description: 'Description' },
                    { path: 'images/ice.jpg' }
                ]);
            };
        }
    ]);