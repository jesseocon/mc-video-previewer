angular.module('mcVideoPreviewerSettings', [])
  .provider('mcVideoPreviewerSettings', function() {
    var _defaults = {
      crossorigin: 'anonymous',
      autoplay: true,
      controls: 'controls'
    }
    , _settings
    , getSettings = function() {
      if(!_settings) {
        _settings = angular.copy(_defaults);
      };

      return _settings;
    };

    this.set = function(prop, value) {
      var s = getSettings();
      if (angular.isObject(prop)) {
        angular.extend(s, prop);
      } else {
        s[prop] = value;
      }
      return this;
    }

    this.$get = getSettings;

    return this;
  });
