'use strict';

angular.module('Authentication', []);
angular.module('Profile', []);

var shareMe = angular.module('shareMe', ['Authentication', 'Profile', 'ngRoute', 'ngCookies', 'ui.bootstrap', 'angularFileUpload']);

shareMe.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'modules/authentication/views/login.html'
        })
        .when('/profile', {
            controller: 'ProfileController',
            templateUrl: 'modules/profile/views/profile.html'
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
        .when('/home', {
            controller: 'HomeController',
            templateUrl: 'modules/profile/views/home.html'
        })
    ;

    $locationProvider.html5Mode(true);
}]);