(function () {
    'use strict';
    var authentication = angular.module('Authentication');
    authentication.controller('LoginController', ['$scope', '$rootScope', '$location', '$timeout', '$http', 'UserService', 'FlashService','$window', function ($scope, $rootScope, $location, $timeout, $http, UserService, FlashService,$window) {
        $scope.login = function () {
            $scope.dataLoading = true;
            $http({
                method: 'POST',
                url: '/login',
                data: {email: $scope.email, password: $scope.password}
            }).then(function (response) {

                $window.sessionStorage.setItem("user_id",response.data.data[0].id);
                
                if (response.data.success) {
                    $location.path('/profile');
                } else {
                    $scope.error = response.data.message;
                    $scope.dataLoading = false;
                }
            }, function (error) {

            });
        };

        $scope.register = function () {
            $scope.dataLoading = true;
            UserService.FetchByEmail($scope.user)
            .then(function (response) {
                if (response.success) {
                    $scope.error = 'Email already exist!';
                    $scope.dataLoading = false;
                } else {
                    UserService.Create($scope.user)
                    .then(function (response) {
                        if (response.success) {
                            FlashService.Success('Registration successful', true);
                            $scope.user = {};
                            $scope.formRegistration.$setPristine();
                        } else {
                            FlashService.Error(response.message);
                        }
                        $scope.dataLoading = false;
                    });
                }
            });
        };
    }]);

    authentication.controller('ForgotController', ['$location', '$scope', 'UserService', 'FlashService', '$http', function ($location, $scope, UserService, FlashService, $http) {
        $scope.forgot = function () {
            $scope.dataLoading = true;
            UserService.FetchByEmail($scope.user)
            .then(function (response) {
                if (response.success) {
                    $http({
                        method: 'POST',
                        url: '/mail/forgot/password',
                        data: $scope.user
                    }).then(function (responseHttp) {
                        if (responseHttp.data.status) {
                            FlashService.Success(responseHttp.data.message, true);
                        } else {
                            FlashService.Error(responseHttp.data.message);
                        }
                        $scope.dataLoading = false;
                    }, function (error) {

                    });
                    $scope.dataLoading = false;
                } else {
                    FlashService.Error(response.message);
                    $scope.dataLoading = false;
                }
            });
        };
    }]);

    authentication.controller('ResetController', ['$scope', '$routeParams', 'FlashService', '$http', function ($scope, $routeParams, FlashService, $http) {
        $scope.changePasswordRequest = false;
        $scope.dataLoading = true;
        $http({
            method: 'POST',
            url: '/reset/validate/token',
            data: {token: $routeParams.token}
        }).then(function (response) {
            if (response.data.status) {
                $scope.changePasswordRequest = true;
                $scope.changePasswordRequestToken = $routeParams.token;
            } else {
                FlashService.Error(response.data.message);
            }
            $scope.dataLoading = false;
        }, function (error) {

        });
        $scope.dataLoading = false;
    }]);

})();