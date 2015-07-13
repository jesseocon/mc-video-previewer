/**
 * mc-video-preview v0.1.0 ()
 * Copyright 2015 Jesse Ocon
 * Licensed under MIT
 */
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideo', ['VideoPreviewer', 'videoSupportChecker']).directive('mcVideo', ['VideoPreviewer', 'videoSupportChecker', '$timeout', 'mcVideoPreviewerSettings', function (VideoPreviewer, videoSupportChecker, $timeout, mcVideoPreviewerSettings) {
    /*jshint -W093 */
    return {
      restrict: 'E',
      transclude: true,
      scope: {
        path: '=path'
      },
      template: '<video class="mc-video-previewer-video" autoplay="{{autoplay}}" controls="{{controls}}" crossorigin="{{crossorigin}}" ng-show="videoSupported === true" style="max-width: 100%;">' + '<source src="{{vidObj.sanitizedPath()}}" type="{{vidObj.mimeType()}}" />' + '</video>' + '<ng-transclude ng-show="imgSupported === true"></ng-transclude>',
      link: function link(scope, element) {
        var handleVideoLoaded, handleVideoSourceError, displayVideo, displayImage, isSupported, isntSupported, source, video;

        if (scope.path === null || scope.path === undefined) {
          throw new Error('The path attribute must be defined');
        }

        if (scope.path === null || scope.path === undefined) {
          throw new Error('This module requires Video Support Checker');
        }

        scope.crossorigin = mcVideoPreviewerSettings.crossorigin;
        scope.controls = mcVideoPreviewerSettings.controls;
        scope.autoplay = mcVideoPreviewerSettings.autoplay;

        scope.$watch('path', function (newValue, oldValue) {
          if (newValue !== oldValue) {
            scope.init();
          }
        });

        scope.imgSupported = false;
        scope.videoSupported = false;

        isSupported = function () {
          return scope.vidObj.isSupportedVideoType() === true;
        };

        isntSupported = function () {
          return scope.vidObj.isSupportedVideoType() === false;
        };

        displayVideo = function () {
          scope.imgSupported = false;
          scope.videoSupported = true;
        };

        displayImage = function () {
          scope.imgSupported = true;
          scope.videoSupported = false;
        };

        scope.init = function () {
          // If there is no support for HTML5 Video there is no need to go any further
          if (videoSupportChecker.video === null || videoSupportChecker.video === undefined) {
            displayImage();
          } else {
            // There is support for HTML5 Video
            scope.vidObj = new VideoPreviewer({
              path: scope.path
            }, videoSupportChecker.video);

            if (isntSupported()) {
              displayImage();
            } else {
              source = void 0;
              video = void 0;
              $timeout(function () {
                source = element.find('source');
                source.on('error', handleVideoSourceError);
                video = element.find('video')[0];
                return video.addEventListener('loadeddata', handleVideoLoaded);
              }, 0, false);
            }

            handleVideoSourceError = function () {
              displayImage();
              scope.$apply();
            };

            handleVideoLoaded = function () {
              displayVideo();
              scope.$apply();
            };
          } // End Main If Else
        };
        scope.init();
      } // End link key
    };
    /*jshint +W093 */
  }]);
})(window, window.angular);
'use strict';

angular.module('mcVideoPreviewerSettings', []).provider('mcVideoPreviewerSettings', function () {
  var _defaults = {
    crossorigin: 'anonymous',
    autoplay: true,
    controls: 'controls'
  },
      _settings,
      getSettings = function getSettings() {
    if (!_settings) {
      _settings = angular.copy(_defaults);
    };

    return _settings;
  };

  this.set = function (prop, value) {
    var s = getSettings();
    if (angular.isObject(prop)) {
      angular.extend(s, prop);
    } else {
      s[prop] = value;
    }
    return this;
  };

  this.$get = getSettings;

  return this;
});
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideoPreviewer', ['mcVideo', 'videoMime', 'VideoPreviewer', 'videoSupportChecker', 'mcVideoPreviewerSettings']);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';
  angular.module('videoMime', []).service('videoMime', function () {
    var extension, isSupportedByBrowser, isSupportedMimeType, isSupportedVideoType, mimeType, service, supportedVideoTypes;

    supportedVideoTypes = ['video/ogg', 'video/webm', 'video/mp4'];

    isSupportedVideoType = function (path, detections) {
      var ext, mime;
      if (path === null || path === undefined) {
        throw new Error('The path argument cannot be blank');
      }
      if (detections === null || detections === undefined) {
        throw new Error('The detections argument cannot be blank');
      }
      ext = extension(path);
      mime = mimeType(ext);
      return isSupportedMimeType(mime) && isSupportedByBrowser(mime, detections);
    };

    extension = function (path) {
      var e, nameArr;
      try {
        nameArr = path.split('.');
      } catch (_error) {
        e = _error;
        throw new Error('The path argument must be defined');
      }
      if (nameArr) {
        return nameArr[nameArr.length - 1];
      }
    };

    mimeType = function (extension) {
      if (extension === null || extension === undefined) {
        throw new Error('The extension argument cannot be blank');
      }
      switch (extension) {
        case 'ogv':
          return 'video/ogg';
        case 'webm':
          return 'video/webm';
        case 'mp4':
          return 'video/mp4';
        case 'm4v':
          return 'video/mp4';
        case '3gp':
          return 'video/3gpp';
        default:
          return 'NaV';
      }
    };

    isSupportedMimeType = function (mime) {
      return supportedVideoTypes.indexOf(mime) > -1;
    };

    isSupportedByBrowser = function (mime, detections) {
      switch (mime) {
        case 'video/ogg':
          return detections.ogg === 'probably';
        case 'video/webm':
          return detections.webm === 'probably';
        case 'video/mp4':
          return detections.h264 === 'probably';
        default:
          return false;
      }
    };

    service = {
      isSupportedVideoType: isSupportedVideoType,
      extension: extension,
      mimeType: mimeType
    };
    return service;
  });
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('VideoPreviewer', []).factory('VideoPreviewer', ['videoMime', '$sce', function (videoMime, $sce) {
    var VideoPreviewer;

    /*jshint -W093 */
    return VideoPreviewer = (function () {
      function VideoPreviewer(options, videoDetections) {
        options = options || {};
        this.videoDetections = videoDetections || {};
        this.path = options.path;
        this.errorMessages = {
          UNDEFINED_PATH: 'The path must be defined to call this function',
          UNDEFINED_BROWSER_DETECTIONS: 'The video detections must be defined'
        };
      }

      VideoPreviewer.prototype.sanitizedPath = function () {
        return $sce.trustAsResourceUrl(this.path);
      };

      VideoPreviewer.prototype.extension = function () {
        var e, ext;
        ext = void 0;
        try {
          ext = videoMime.extension(this.path);
        } catch (_error) {
          e = _error;
          throw new Error({
            error: e,
            reason: 'The filepath is not defined'
          });
        }
        return ext;
      };

      VideoPreviewer.prototype.mimeType = function () {
        var ext, mime;
        ext = this.extension();
        mime = void 0;
        if (ext !== null || ext !== undefined) {
          return videoMime.mimeType(ext);
        }
      };

      VideoPreviewer.prototype.isSupportedVideoType = function () {
        return videoMime.isSupportedVideoType(this.path, this.videoDetections);
      };

      return VideoPreviewer;
    })();

    /*jshint +W093 */
  }]);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('videoSupportChecker', []).service('videoSupportChecker', function () {
    var service, supportsVideo, supports_h264_baseline_video, supports_ogg_theora_video, supports_webm_video, video;

    supportsVideo = function () {
      return !!document.createElement('video').canPlayType;
    };

    supports_h264_baseline_video = function () {
      var v = document.createElement('video');
      return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    };

    supports_ogg_theora_video = function () {
      var v = document.createElement('video');
      return v.canPlayType('video/ogg; codecs="theora, vorbis"');
    };

    supports_webm_video = function () {
      var v = document.createElement('video');
      return v.canPlayType('video/webm; codecs="vp8, vorbis"');
    };

    if (supportsVideo() === true) {
      video = {
        webm: supports_webm_video(),
        ogg: supports_ogg_theora_video(),
        h264: supports_h264_baseline_video()
      };
    } else {
      video = undefined;
    }

    service = {
      video: video
    };

    return service;
  });
})(window, window.angular);