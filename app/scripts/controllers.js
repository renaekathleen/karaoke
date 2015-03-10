'use strict';

angular.module('karaokeApp')
  .controller('SearchCtrl', function ($scope, $http) {
    $scope.songs = [];
    $scope.query = '';
    $scope.searchParams = {
      'orderby': 'relevance',
      'alt': 'json',
      'max-results': 12,
      'v': 2
    };
    $scope.search = function () {
      $scope.loading = true;
      $scope.searchParams.q = 'karaoke' + $scope.query;
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
            $scope.err = 'No results. :(';

          }
        })
        .error(function () {
          $scope.err = 'Youtube is having issues. :(';
        });
    };
  })
  .controller('SingCtrl', function ($scope, $routeParams) {
    var voice = document.querySelector('#voice');
    var video = null;
    $scope.songId = $routeParams.songId;
    $scope.volume = 0.5;
    $scope.step = 0.02;
    $scope.playerVars = {
      'controls': 0,
      'rel': 0
    };

    $scope.adjustVolume = function () {
      video.setVolume(($scope.volume) * 100);
      voice.volume = 1 - $scope.volume;
    };

    $scope.togglePlay = function () {
      var state = video.getPlayerState();
      if (state === 0 || state === 2 || state === 5) {  //ended, paused, or queued
        video.playVideo();
      } else if (state === 1) { //playing
        video.pauseVideo();
      }
    };

    $scope.$on('youtube.player.ready', function ($event, player) {
      $scope.loading = false;
      video = player;
    });

    navigator.getUserMedia = ( navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia);

    if (navigator.getUserMedia) {
      navigator.getUserMedia(
        {
          video: false,
          audio: true
        },
        function (localMediaStream) {
          voice.src = window.URL.createObjectURL(localMediaStream);
          voice.volume = 0.5;
          voice.play();
        },
        function (err) {
          console.log('The following error occurred: ' + err);
        }
      );
    } else {
      console.log('getUserMedia is not supported in your browser.');
    }
    window.onkeydown = function (e) {
      if (e.keyCode === 32 || e.keyCode === 37 || e.keyCode === 39) {
        e.preventDefault();
      }
      switch (e.keyCode) {
        case 32:
          $scope.togglePlay();
          break;
        case 37:
          if ($scope.volume > 0) {
          $scope.volume -= $scope.step;
          }
          break;
        case 39:
          if ($scope.volume < 1) {
            $scope.volume += $scope.step;
          }
          break;
      }
      console.log($scope.volume);
      $scope.$apply();
    };
  });

