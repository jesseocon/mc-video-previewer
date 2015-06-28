(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreview', [
      'mcVideoPreview.mcVideo',
      'mcVideoPreview.videoMime',
      'mcVideoPreview.VideoPreviewer',
      'mcVideoPreview.videoSupportChecker'
    ]);

})(window, window.angular);
