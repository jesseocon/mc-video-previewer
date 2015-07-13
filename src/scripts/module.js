(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreviewer', [
      'mcVideo',
      'videoMime',
      'VideoPreviewer',
      'videoSupportChecker',
      'mcVideoPreviewerSettings'
    ]);

})(window, window.angular);
