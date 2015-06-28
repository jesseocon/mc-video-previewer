(function(window, angular, undefined) {
  'use strict';
  angular
    .module('mcVideoPreviewer.videoMime', [])
    .service('videoMime', function() {
      var extension,
          isSupportedByBrowser,
          isSupportedMimeType,
          isSupportedVideoType,
          mimeType,
          service,
          supportedVideoTypes;

      supportedVideoTypes = ['video/ogg', 'video/webm', 'video/mp4'];

      isSupportedVideoType = function(path, detections) {
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

      extension = function(path) {
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

      mimeType = function(extension) {
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

      isSupportedMimeType = function(mime) {
        return supportedVideoTypes.indexOf(mime) > -1;
      };

      isSupportedByBrowser = function(mime, detections) {
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
