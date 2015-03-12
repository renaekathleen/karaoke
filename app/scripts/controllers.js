'use strict';

angular.module('karaokeApp')
  .controller('SearchCtrl', function ($scope, $http, $routeParams, $location) {
    $scope.err = null;
    $scope.songs = [];
    $scope.query = '';
    $scope.searchParams = {
      'orderby': 'relevance',
      'alt': 'json',
      'max-results': 24,
      'format': 5,
      'v': 2
    };
    $scope.search = function () {
      $location.path('/search/' + $scope.query);

    };
    if ($routeParams.query) {
      $scope.query = $routeParams.query;
      $scope.searchParams.q = 'karaoke' + $routeParams.query;
      $http({
        url: 'https://gdata.youtube.com/feeds/api/videos',
        method: 'GET',
        params: $scope.searchParams
      })
        .success(function (data) {
          if (data.feed.entry && data.feed.entry.length) {
            $scope.songs = data.feed.entry;
          }
          else {
            $scope.err = 'No results.';

          }
        })
        .error(function () {
          $scope.err = 'Youtube is having issues.';
        });
    }
  })
  .controller('SingCtrl', function ($rootScope, $scope, $routeParams, $window) {
    var video = null;
    $scope.err = null;
    $scope.loading = true;
    $scope.isPaused = true;
    $scope.songId = $routeParams.songId;
    $scope.volume = 0.5;
    $scope.step = 0.05;
    $scope.playerVars = {
      'controls': 0,
      'rel': 0
    };

    $scope.adjustVolume = function () {
      video.setVolume(($scope.volume) * 100);
      $rootScope.voice.volume = 1 - $scope.volume;
    };

    $scope.togglePlay = function () {
      var state = video.getPlayerState();
      if (state === 0 || state === 2 || state === 5) {  //ended, paused, or queued
        video.playVideo();
        $scope.isPaused = false;
      } else if (state === 1) { //playing
        video.pauseVideo();
        $scope.isPaused = true;
      }
    };

    $scope.$on('youtube.player.ready', function ($event, player) {
      $scope.loading = false;
      video = player;
    });
     $window.addEventListener('keydown', function(e){
      switch (e.keyCode) {
        case 32:
          $scope.togglePlay();
          break;
        case 37:
          if ($scope.volume >= $scope.step) {
            $scope.volume = Math.round(($scope.volume - $scope.step) * 100) / 100;
          }
          break;
        case 39:
          if ($scope.volume <= (1 - $scope.step)) {
            $scope.volume = Math.round(($scope.volume + $scope.step) * 100) / 100;
          }
          break;
      }
      $scope.adjustVolume();
      $scope.$apply();
    });
  });

