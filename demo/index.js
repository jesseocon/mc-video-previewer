'use strict';

angular
  .module('demoApp', [
    'mcVideoPreviewer'
  ])
  .controller('demoMainController', function($scope) {
    $scope.mp4Path = './small-mp4.mp4';
    $scope.oggPath = './small-ogg.ogv';
    $scope.webmPath = './small-webm.webm';
    $scope.threegp = './small.3gp';
  });
