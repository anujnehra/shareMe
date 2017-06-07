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
        .when('/', {
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

shareMe.run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {

        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata;
        }

        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if (($location.path() !== '/login' && !$rootScope.globals.currentUser) && ($location.path() !== '/register') && ($location.path() !== '/forgot') && ($location.path() !== '/password/reset/:token')) {
                //$location.path('/login');
            }
        });
    }
]);