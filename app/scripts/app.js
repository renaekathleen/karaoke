'use strict';

var karaoke = angular.module('karaokeApp', [
    'ngRoute',
    'youtube-embed'
  ]);

karaoke.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'views/search.html',
    controller: 'SearchCtrl'
  })
    .when('/sing/:songId', {
      templateUrl: 'views/sing.html',
      controller: 'SingCtrl'
    })
    .otherwise({redirectTo: '/'});
}]);

