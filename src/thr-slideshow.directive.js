angular
    .module('thr-slideshow', [])
    .directive('thrSlideshow', [
        '$window', '$interval', 'thrSlideshow',
        (window, interval, thrSlideshow) => ({
            restrict: 'E',
            scope: true,
            templateUrl: 'thr-slideshow.html',
            link: (scope, element) => {
                scope.slideshow = thrSlideshow;

                scope.selectedImg = [];
                scope.thumbnails = [];
                scope.hidePlayIcon = true;
                scope.isMaximized = false;
                scope.close = () => {
                    scope.hidePlayIcon = true;
                    scope.pause();
                    scope.isMaximized = false;
                    scope.slideshow.hide();
                    closeFullScreen();
                };

                scope.$watch('slideshow.visible', isVisible => {
                    if (isVisible) {
                        scope.slideBox(scope.slideshow.photoIndex);
                    }
                });

                scope.slideBox = index => {
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

                let beginThumnail = 0;
                scope.selectedThumbIndex = 0;
                const getThumbnails = index => {
                    let endThumbnail = numberOfThumb();
                    if (endThumbnail < index || endThumbnail === index) {
                        beginThumnail = (index - endThumbnail + 1);
                    } else if (beginThumnail > index) {
                        beginThumnail = index;
                    }

                    const length = scope.slideshow.photosList.length;
                    const thumbs = [];
                    let thumb = {};
                    let begin = beginThumnail;
                    for (let i = 0; i < endThumbnail; i++) {
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

                angular.element(window).bind('resize', () => {
                    scope.thumbnails = getThumbnails(scope.selectedIndex);
                    scope.$digest();
                });

                angular.element(window).keyup(e => {
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
                    const thum_size = 160;
                    const area = document.getElementsByClassName('preview-area')[0];
                    let number = parseInt(area.offsetWidth / thum_size);
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

                scope.next = () => {
                    scope.directionIsNext = true;
                    const size = scope.slideshow.photosList.length;
                    scope.selectedIndex = (scope.selectedIndex + 1) % size;
                    scope.selectedImg = scope.slideshow.photosList[scope.selectedIndex];
                    scope.thumbnails = getThumbnails(scope.selectedIndex);
                    scope.play();
                };

                scope.preview = () => {
                    scope.directionIsNext = false;
                    const size = scope.slideshow.photosList.length;
                    if (scope.selectedIndex === 0) {
                        scope.selectedIndex = size - 1;
                    } else {
                        scope.selectedIndex -= 1;
                    }
                    scope.selectedImg = scope.slideshow.photosList[scope.selectedIndex];
                    scope.thumbnails = getThumbnails(scope.selectedIndex);
                    scope.play();
                };

                scope.playOrPause = () => {
                    scope.hidePlayIcon = !scope.hidePlayIcon;
                    if (scope.playSlide) {
                        scope.pause();
                    } else {
                        scope.play();
                    }
                };

                scope.play = () => {
                    scope.hidePlayIcon = true;
                    interval.cancel(scope.playSlide);
                    scope.playSlide = interval(() => {
                        scope.next();
                    }, 5000);
                };

                scope.pause = () => {
                    scope.hidePlayIcon = false;
                    if (scope.playSlide) {
                        interval.cancel(scope.playSlide);
                        scope.playSlide = undefined;
                    }
                };

                scope.maximize = event => {
                    const slidebox = angular.element(event.target).closest('.new-slideBox')[0];
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