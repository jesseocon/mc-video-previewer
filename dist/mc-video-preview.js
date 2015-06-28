/**
 * mc-video-preview v0.1.0 ()
 * Copyright 2015 Jesse Ocon
 * Licensed under MIT
 */
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideoPreview.mcVideo', ['mcVideoPreview.VideoPreviewer', 'mcVideoPreview.videoSupportChecker']).directive('mcVideo', ['VideoPreviewer', 'videoSupportChecker', '$timeout', function (VideoPreviewer, VideoSupportChecker, $timeout) {
    return {
      restrict: 'E',
      controller: 'TestController',
      scope: {
        path: '=path'
      },
      template: '<div class="mc-video-preview">{{message}}</div>',
      link: function link(scope, element, attrs) {
        var handleVideoLoaded, handleVideoSourceError, source, video;
        if (scope.path == null) {
          throw new Error('The path attribute must be defined');
        }

        if (scope.path == null) {
          throw new Error('This module requires Video Support Checker');
        }
        scope.imgSupported = false;
        scope.videoSupported = false;
        scope.vidObj = new VideoPreviewer({
          path: scope.path
        }, videoSupportChecker.video);

        scope.isSupported = function () {
          return scope.vidObj.isSupportedVideoType() === true;
        };

        scope.isntSupported = function () {
          return scope.vidObj.isSupportedVideoType() === false;
        };

        scope.displayVideo = function () {
          return scope.$apply(function () {
            scope.imgSupported = false;
            return scope.videoSupported = true;
          });
        };

        scope.displayImage = function () {
          return scope.$apply(function () {
            scope.imgSupported = true;
            return scope.videoSupported = false;
          });
        };

        if (scope.isntSupported()) {
          return scope.displayImage();
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

        handleVideoSourceError = function (e) {
          return scope.displayImage();
        };

        handleVideoLoaded = function (e) {
          return scope.displayVideo();
        };
      }
    };
  }]);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideoPreview', ['mcVideoPreview.mcVideo', 'mcVideoPreview.videoMime', 'mcVideoPreview.VideoPreviewer', 'mcVideoPreview.videoSupportChecker']);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';
  angular.module('mcVideoPreview.videoMime', []).service('videoMime', function () {
    var extension, isSupportedByBrowser, isSupportedMimeType, isSupportedVideoType, mimeType, service, supportedVideoTypes;

    supportedVideoTypes = ['video/ogg', 'video/webm', 'video/mp4'];

    isSupportedVideoType = function (path, detections) {
      var ext, mime;
      if (path == null) {
        throw new Error('The path argument cannot be blank');
      }
      if (detections == null) {
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
      if (extension == null) {
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

  angular.module('mcVideoPreview.VideoPreviewer', []).factory('VideoPreviewer', ['videoMime', '$sce', function (videoMime, $sce) {
    var VideoPreviewer;
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
      };

      VideoPreviewer.prototype.mimeType = function () {
        var ext, mime;
        ext = this.extension();
        mime = void 0;
        if (ext != null) {
          return videoMime.mimeType(ext);
        }
      };

      VideoPreviewer.prototype.isSupportedVideoType = function () {
        return videoMime.isSupportedVideoType(this.path, this.videoDetections);
      };

      return VideoPreviewer;
    })();
  }]);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('mcVideoPreview.videoSupportChecker', []).service('videoSupportChecker', function () {
    var service, supportsVideo, supports_h264_baseline_video, supports_ogg_theora_video, supports_webm_video, video;

    var supportsVideo = function supportsVideo() {
      return !!document.createElement('video').canPlayType;
    };

    var supports_h264_baseline_video = function supports_h264_baseline_video() {
      var v = document.createElement('video');
      return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    };

    var supports_ogg_theora_video = function supports_ogg_theora_video() {
      var v = document.createElement('video');
      return v.canPlayType('video/ogg; codecs="theora, vorbis"');
    };

    var supports_webm_video = function supports_webm_video() {
      var v = document.createElement('video');
      return v.canPlayType('video/webm; codecs="vp8, vorbis"');
    };

    video = new Boolean(supportsVideo());
    if (!!video === true) {
      video.webm = supports_webm_video();
      video.ogg = supports_ogg_theora_video();
      video.h264 = supports_h264_baseline_video();
    }

    service = {
      video: video
    };

    return service;
  });
})(window, window.angular);