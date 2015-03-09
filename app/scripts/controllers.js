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
    $scope.songId = $routeParams.songId;
    $scope.playerVars = {
      'controls': 0,
      'rel': 0
    };
    $scope.$on('youtube.player.ready', function () {
      $scope.loading = false;
    });
  });

