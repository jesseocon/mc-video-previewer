(function(window, angular, undefined) {
  'use strict';

  angular
    .module('mcVideoPreview.videoSupportChecker', [])
    .service('videoSupportChecker', function(){
      var service,
          supportsVideo,
          supports_h264_baseline_video,
          supports_ogg_theora_video,
          supports_webm_video,
          video;

      supportsVideo = function () {
        return !!document.createElement('video').canPlayType;
      };

      supports_h264_baseline_video = function () {
        var v = document.createElement("video");
        return v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
      };

      supports_ogg_theora_video = function () {
        var v = document.createElement("video");
        return v.canPlayType('video/ogg; codecs="theora, vorbis"');
      };

      supports_webm_video  = function () {
        var v = document.createElement("video");
        return v.canPlayType('video/webm; codecs="vp8, vorbis"');
      };

      if (supportsVideo() === true) {
        video = {
          webm: supports_webm_video(),
          ogg:  supports_ogg_theora_video(),
          h264: supports_h264_baseline_video(),
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
