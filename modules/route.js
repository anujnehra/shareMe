'use strict';

angular.module('Authentication', []);
angular.module('Home', []);

var shareMe = angular.module('shareMe', ['Authentication', 'Home', 'ngRoute', 'ngCookies']);

shareMe.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html'
        })
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'modules/home/views/home.html'
        })
        .when('/logout', {
            controller: 'LogoutController',
            templateUrl: 'modules/authentication/views/login.html'
        })
        .when('/forgot', {
            controller: 'ForgotController',
            templateUrl: 'modules/authentication/views/forgot.html'
        })
        .when('/password/reset/:token', {
            controller: 'ResetController',
            templateUrl: 'modules/authentication/views/reset.html'
        })
    ;

    $locationProvider.html5Mode(true);
}]);