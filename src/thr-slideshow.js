angular
    .module('thr-slideshow', [])
    .directive('thrSlideshow', [
        () => ({
            restrict: 'E',
            scope:true,
            templateUrl: 'thr-slideshow.html',
            link: (scope, element) => {
                scope.slideshow = $rootScope.slideshow;

                scope.translation = translation;
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
                    scope.play();
                    return false;
                };

                scope.selectedIndex = scope.slideshow.photoIndex;
                scope.playSlide = undefined;
                scope.directionIsNext = true;

                var beginThumnail = 0;
                scope.selectedThumbIndex = 0;
                var getThumbnails = function (index) {
                    var endThumbnail = numberOfThumb();
                    if (endThumbnail < index || endThumbnail === index) {
                        beginThumnail = (index - endThumbnail + 1);
                    } else if (beginThumnail > index) {
                        beginThumnail = index;
                    }

                    var length = scope.slideshow.photosList.length;
                    var thumbs = [];
                    var thumb = {};
                    var begin = beginThumnail;
                    for (var i = 0; i < endThumbnail; i++) {
                        thumb = {};
                        begin = (begin) % length;
                        thumb.index = begin;
                        if (index === begin) {
                            scope.selectedThumbIndex = i;
                        }
                        thumb.photo = scope.slideshow.photosList[begin];
                        thumbs.push(thumb);
                        begin += 1;
                        if (length === (i + 1)) {
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


                function toggleFullScreen(element) {
                    if (document.fullscreenEnabled || document.mozFullscreenEnabled || document.webkitIsFullScreen ||
                        document.msFullscreenElement || scope.isMaximized) {
                        closeFullScreen();
                    } else if (!document.fullscreenElement && !document.mozFullScreenElement &&
                        !document.webkitFullscreenElement && !document.msFullscreenElement) {
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
        })
    ]);