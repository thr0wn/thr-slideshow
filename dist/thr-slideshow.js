'use strict';

angular.module('thr-slideshow', []).directive('thrSlideshow', ['$window', '$interval', 'thrSlideshow', function (window, interval, thrSlideshow) {
    return {
        restrict: 'E',
        scope: true,
        templateUrl: 'thr-slideshow.html',
        link: function link(scope, element) {
            scope.slideshow = thrSlideshow;

            scope.selectedImg = [];
            scope.thumbnails = [];
            scope.hidePlayIcon = true;
            scope.isMaximized = false;
            scope.close = function () {
                scope.hidePlayIcon = true;
                scope.pause();
                scope.isMaximized = false;
                scope.slideshow.hide();
                closeFullScreen();
            };

            scope.$watch('slideshow.visible', function (isVisible) {
                if (isVisible) {
                    scope.slideBox(scope.slideshow.photoIndex);
                }
            });

            scope.slideBox = function (index) {
                if (index < scope.selectedIndex) {
                    scope.directionIsNext = false;
                } else {
                    scope.directionIsNext = true;
                }
                scope.selectedIndex = index;

                scope.selectedImg = scope.slideshow.photosList[index];
                scope.showPopup = true;
                scope.thumbnails = getThumbnails(index);

                // do not autoplay
                //scope.play();
                scope.pause();
                scope.hidePlayIcon = true;

                return false;
            };

            scope.selectedIndex = scope.slideshow.photoIndex;
            scope.playSlide = undefined;
            scope.directionIsNext = true;

            var beginThumnail = 0;
            scope.selectedThumbIndex = 0;
            var getThumbnails = function getThumbnails(index) {
                var endThumbnail = numberOfThumb();
                if (endThumbnail < index || endThumbnail === index) {
                    beginThumnail = index - endThumbnail + 1;
                } else if (beginThumnail > index) {
                    beginThumnail = index;
                }

                var length = scope.slideshow.photosList.length;
                var thumbs = [];
                var thumb = {};
                var begin = beginThumnail;
                for (var i = 0; i < endThumbnail; i++) {
                    thumb = {};
                    begin = begin % length;
                    thumb.index = begin;
                    if (index === begin) {
                        scope.selectedThumbIndex = i;
                    }
                    thumb.photo = scope.slideshow.photosList[begin];
                    thumbs.push(thumb);
                    begin += 1;
                    if (length === i + 1) {
                        break;
                    }
                }
                endThumbnail = begin;
                return thumbs;
            };

            angular.element(window).bind('resize', function () {
                scope.thumbnails = getThumbnails(scope.selectedIndex);
                scope.$digest();
            });

            angular.element(window).keyup(function (e) {
                switch (e.keyCode) {
                    case 27:
                        if (scope.isMaximized) {
                            scope.isMaximized = !scope.isMaximized;
                            closeFullScreen();
                        } else {
                            scope.close();
                        }
                        break;
                    case 39:
                        scope.next();
                        break;
                    case 37:
                        scope.preview();
                        break;
                    case 80:
                        scope.playOrPause();
                        break;
                }
            });

            function numberOfThumb() {
                var thum_size = 160;
                var area = document.getElementsByClassName('preview-area')[0];
                var number = parseInt(area.offsetWidth / thum_size);
                if (number === 0) {
                    number = parseInt(window.innerWidth / thum_size);
                }
                if (number > 7) {
                    return 7;
                } else if (number < 3) {
                    return 2;
                }
                return number;
            }

            scope.next = function () {
                scope.directionIsNext = true;
                var size = scope.slideshow.photosList.length;
                scope.selectedIndex = (scope.selectedIndex + 1) % size;
                scope.selectedImg = scope.slideshow.photosList[scope.selectedIndex];
                scope.thumbnails = getThumbnails(scope.selectedIndex);
                scope.play();
            };

            scope.preview = function () {
                scope.directionIsNext = false;
                var size = scope.slideshow.photosList.length;
                if (scope.selectedIndex === 0) {
                    scope.selectedIndex = size - 1;
                } else {
                    scope.selectedIndex -= 1;
                }
                scope.selectedImg = scope.slideshow.photosList[scope.selectedIndex];
                scope.thumbnails = getThumbnails(scope.selectedIndex);
                scope.play();
            };

            scope.playOrPause = function () {
                scope.hidePlayIcon = !scope.hidePlayIcon;
                if (scope.playSlide) {
                    scope.pause();
                } else {
                    scope.play();
                }
            };

            scope.play = function () {
                scope.hidePlayIcon = true;
                interval.cancel(scope.playSlide);
                scope.playSlide = interval(function () {
                    scope.next();
                }, 5000);
            };

            scope.pause = function () {
                scope.hidePlayIcon = false;
                if (scope.playSlide) {
                    interval.cancel(scope.playSlide);
                    scope.playSlide = undefined;
                }
            };

            scope.maximize = function (event) {
                var slidebox = angular.element(event.target).closest('.new-slideBox')[0];
                toggleFullScreen(slidebox);
                scope.isMaximized = !scope.isMaximized;
            };

            scope.getFileExt = function (path) {
                return path.split('.').pop();
            };

            scope.isVideo = function (path) {
                var ext = scope.getFileExt(path);

                return ext == 'mp4';
            };

            function toggleFullScreen(element) {
                if (document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen || document.msFullscreenElement || scope.isMaximized) {
                    closeFullScreen();
                } else if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
                    openFullScreen(element);
                }
            }

            function openFullScreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                } else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                } else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                } else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
                }
            }

            function closeFullScreen() {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                }
            }
        }
    };
}]);
angular.module('thr-slideshow').run(['$templateCache', function($templateCache) {$templateCache.put('thr-slideshow.html','<div ng-if="slideshow.visible">\r\n    <div class="new-slideBox" ng-swipe-left="next()" ng-swipe-right="preview()">\r\n        <a ng-class="{\'icon-resize\':!isMaximized, \'icon-collapse\': isMaximized}" ng-click="maximize($event)">\r\n            <i class="fa" ng-class="{\'fa-expand\':!isMaximized, \'fa-compress\': isMaximized}" aria-hidden="true"></i>\r\n        </a>\r\n        <a class="icon-close" ng-click="close()">\r\n            <i class="fa fa-times" aria-hidden="true"></i>\r\n        </a>\r\n        <div ng-click="close()" class="image-area" ng-class="{maximized : isMaximized, \'only-one\':slideshow.photosList.length === 1}">\r\n            <ul ng-if="slideshow.photosList.length">\r\n                <li ng-repeat="photo in slideshow.photosList" ng-class="{\'next\':directionIsNext,\'preview\':!directionIsNext, selected:$index === selectedIndex, disable:$index !== selectedIndex}">\r\n                    <div ng-class="{\'photo-with-description table-layout\':(photo.description && !isMaximized),\'photo-container\':(!photo.description || isMaximized)}">\r\n                        <div class="photo" ng-class="{\'maximizedPhoto\': isMaximized, \'column-layout\':photo.description && !isMaximized}">\r\n\r\n                            <!-- image -->\r\n                            <img ng-click="playOrPause(); $event.stopPropagation();" ng-src="{{photo.path}}" alt="" ng-if="!isVideo(photo.path)" />\r\n\r\n                            <!-- video -->\r\n                            <video controls ng-if="isVideo(photo.path)">\r\n                                <source ng-src="{{photo.path}}" type="video/{{getFileExt(photo.path)}}">\r\n                            </video>\r\n\r\n                            <a ng-click="playOrPause(); $event.stopPropagation();" class="container-icon-play" ng-hide="hidePlayIcon"><span class="icon-play"></span></a>\r\n                        </div>\r\n                        <div ng-if="photo.description && !isMaximized" class="column-layout description-container">\r\n                            <p class="description">{{photo.description}}</p>\r\n                        </div>\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n        </div>\r\n        <div class="preview-area" ng-show="thumbnails.length > 1 && !isMaximized">\r\n            <a class="icon-angle-left" ng-click="preview()">\r\n                <i class="fa fa-angle-left" aria-hidden="true"></i>\r\n            </a>\r\n            <ul>\r\n                <li class="thumbnail-item" ng-repeat="thumb in thumbnails">\r\n                    <div ng-class="{selected:$index === selectedThumbIndex}" ng-click="slideBox(thumb.index)">\r\n                        <img class="slideshow-thumbnail" ng-src="{{thumb.photo.path}}" alt="" ng-if="!isVideo(thumb.photo.path)" />\r\n                        <img class="slideshow-thumbnail" src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBAUEBAYFBQUGBgYHCQ4JCQgICRINDQoOFRIWFhUSFBQXGiEcFxgfGRQUHScdHyIjJSUlFhwpLCgkKyEkJST/2wBDAQYGBgkICREJCREkGBQYJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCT/wgARCABKAIIDAREAAhEBAxEB/8QAGwABAQADAQEBAAAAAAAAAAAABAMAAQIFBgj/xAAUAQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAD8xiBQoQXKHRhomRDBgoYkIFCxQksdGzDRyTDBQgUgIFjRQgoYYbNGHBAKDBkBAwYLLHRgoWeWaNEggMGQLDBoosbKnphCQcwkFBAyJ2NGCyxs6PrTR5J45hEMCBhygsaKLnZsWYRInJEKDBkDoUMFiCh0YYYaJkAgQIRMEixQksdnRho4IhwoQMRNiBQoQWKnRhomRDBgocmf/8QAMhAAAwEAAQIDBQMNAAAAAAAAAAECAxEEEBIhMQVBUWFxFTLBBhMUIDNSU2JykqKx0f/aAAgBAQABPwCJM5M4M8/kRmTmLNHhR4UOF8Csy8/kaZ/I0zNILkcmaM5MpM4IgUiSODgaHJcmkGkeprJpI5MkZSZSZSShLvM1deGJdV68JcvtwNGkmsmsmqGjJGSMkZoldm0vUy9n71mtry2nNvheGear6L8Wa79P7PcfommqufvZLjzf81fgin4qdcJctvheS7NFryNUbI1XbNGJkjMnt0mn5rqsrcqkqS4r0NMLe+/S5bb5U+aapN1t9K5/4ZezZ1wvTPXRvP72by4pG/TTljltGvjm2005cuX8Guz9CzQ1Nff2yZkZMzZPbL9rn/XP+0Nvlr3cnLPygbcdPz+8+9s1ZszXtkzKjKjOiX2Taaa9U+V9T7X6737/AOKPtfrv4y/sRv1m/VKVtp4lPLXklx2plv1NaNWavtmzKjKjOiKE/h+q2VRpSNaNaNKOSGZ0Z2Z38yLJoVHiPEOiq8i78jSzWzSi6GyDIyMiG+CSSe9lmhoaFdv/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAECAQE/ACr/xAAUEQEAAAAAAAAAAAAAAAAAAABw/9oACAEDAQE/ACr/2Q=="\r\n                            alt="" ng-if="isVideo(thumb.photo.path)" />\r\n                    </div>\r\n                </li>\r\n            </ul>\r\n            <a class="icon-angle-right" ng-click="next()">\r\n                <i class="fa fa-angle-right" aria-hidden="true"></i>\r\n            </a>\r\n        </div>\r\n    </div>\r\n</div>');}]);
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

angular.module('thr-slideshow').service('thrSlideshow', function () {
    function _class() {
        _classCallCheck(this, _class);

        this.visible = false;
        this.photosList = [];
        this.photoIndex = 0;
    }

    _createClass(_class, [{
        key: 'show',
        value: function show(photosList, index) {
            this.photosList = photosList;
            this.photoIndex = index || 0;
            this.visible = true;
        }
    }, {
        key: 'hide',
        value: function hide() {
            this.visible = false;
            this.photosList = [];
            this.photoIndex = 0;
        }
    }]);

    return _class;
}());