(function () {
    'use strict';

    var home = angular.module('Home');

    home.controller('HomeController', ['$scope', function ($scope) {
        console.log('home controller');
    }]);
})();