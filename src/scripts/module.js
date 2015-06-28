(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreviewer', [
      'mcVideoPreviewer.mcVideo',
      'mcVideoPreviewer.videoMime',
      'mcVideoPreviewer.VideoPreviewer',
      'mcVideoPreviewer.videoSupportChecker'
    ]);

})(window, window.angular);
