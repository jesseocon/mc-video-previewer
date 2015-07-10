(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreviewer', [
      'mcVideo',
      'videoMime',
      'VideoPreviewer',
      'videoSupportChecker'
    ]);

})(window, window.angular);
