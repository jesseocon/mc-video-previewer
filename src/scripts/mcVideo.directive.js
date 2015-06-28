(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreview.mcVideo', [
      'mcVideoPreview.VideoPreviewer',
      'mcVideoPreview.videoSupportChecker'
    ])
    .directive('mcVideo', [
      'VideoPreviewer', 'videoSupportChecker', '$timeout', function(VideoPreviewer, videoSupportChecker, $timeout) {
        /*jshint -W093 */
        return {
          restrict: 'E',
          controller: 'TestController',
          scope: {
            path: '=path'
          },
          template: '<div class="mc-video-preview">{{message}}</div>',
          link: function(scope, element) {
            var handleVideoLoaded,
                handleVideoSourceError,
                displayVideo, displayImage,
                isSupported, isntSupported,
                source, video;

            if (scope.path === null || scope.path === undefined) {
              throw new Error('The path attribute must be defined');
            }

            if (scope.path === null || scope.path === undefined) {
              throw new Error('This module requires Video Support Checker');
            }

            scope.imgSupported   = false;
            scope.videoSupported = false;

            isSupported = function() {
              return scope.vidObj.isSupportedVideoType() === true;
            };

            isntSupported = function() {
              return scope.vidObj.isSupportedVideoType() === false;
            };

            displayVideo = function() {
              return scope.$apply(function() {
                scope.imgSupported = false;
                scope.videoSupported = true;
              });
            };

            displayImage = function() {
              return scope.$apply(function() {
                scope.imgSupported = true;
                scope.videoSupported = false;
              });
            };

            // If there is no support for HTML5 Video there is no need to go any further
            if (videoSupportChecker.video === null || videoSupportChecker.video === undefined) {
              displayImage();
            } else { // There is support for HTML5 Video
              scope.vidObj = new VideoPreviewer({
                path: scope.path
              }, videoSupportChecker.video);


              if (isntSupported()) {
                displayImage();
              } else {
                source = void 0;
                video = void 0;
                $timeout(function() {
                  source = element.find('source');
                  source.on('error', handleVideoSourceError);
                  video = element.find('video')[0];
                  return video.addEventListener('loadeddata', handleVideoLoaded);
                }, 0, false);
              }

              handleVideoSourceError = function() {
                return displayImage();
              };

              handleVideoLoaded = function() {
                return displayVideo();
              };

            } // End Main If Else
          } // End link key
        };
        /*jshint +W093 */
      }
    ]);

})(window, window.angular);
