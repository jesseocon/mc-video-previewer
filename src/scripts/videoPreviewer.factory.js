(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreview.VideoPreviewer', [])
    .factory('VideoPreviewer', [
      'videoMime','$sce', function(videoMime, $sce) {
       var VideoPreviewer;

        /*jshint -W093 */
       return VideoPreviewer = (function() {
         function VideoPreviewer(options, videoDetections) {
           options = options || {};
           this.videoDetections = videoDetections || {};
           this.path = options.path;
           this.errorMessages = {
             UNDEFINED_PATH: 'The path must be defined to call this function',
             UNDEFINED_BROWSER_DETECTIONS: 'The video detections must be defined'
           };
         }

         VideoPreviewer.prototype.sanitizedPath = function() {
           return $sce.trustAsResourceUrl(this.path);
         };

         VideoPreviewer.prototype.extension = function() {
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

         VideoPreviewer.prototype.mimeType = function() {
           var ext, mime;
           ext = this.extension();
           mime = void 0;
           if (ext !== null || ext !== undefined) {
             return videoMime.mimeType(ext);
           }
         };

         VideoPreviewer.prototype.isSupportedVideoType = function() {
           return videoMime.isSupportedVideoType(this.path, this.videoDetections);
         };

         return VideoPreviewer;

       })();

       /*jshint +W093 */
      }
    ]);
})(window, window.angular);
