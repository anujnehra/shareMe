(function () {
    'use strict';
    var authentication = angular.module('Authentication');
    authentication.controller('LoginController', ['$scope', '$rootScope', '$location', '$timeout', 'AuthenticationService', '$http', 'UserService', 'FlashService', function ($scope, $rootScope, $location, $timeout, AuthenticationService, $http, UserService, FlashService) {

        if ($rootScope.globals.currentUser) {
            $location.path('/');
        } else {
            AuthenticationService.ClearCredentials();
            $scope.login = function () {
                $scope.dataLoading = true;
                $http.post('/api/login', {email: $scope.email, password: $scope.password})
                    .success(function (response) {
                        if (response.success) {
                            AuthenticationService.SetCredentials($scope.email, $scope.password);
                            $location.path('/');
                        } else {
                            $scope.error = response.message;
                            $scope.dataLoading = false;
                        }
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
        }
    }]);

    authentication.controller('LogoutController', ['$location', 'AuthenticationService', function ($location, AuthenticationService) {
        AuthenticationService.ClearCredentials();
        $location.path('/login');
    }]);

    authentication.controller('ForgotController', ['$location', 'AuthenticationService', '$scope', 'UserService', 'FlashService', '$http', function ($location, AuthenticationService, $scope, UserService, FlashService, $http) {
        AuthenticationService.ClearCredentials();
        $scope.forgot = function () {
            $scope.dataLoading = true;
            UserService.FetchByEmail($scope.user)
                .then(function (response) {
                    if (response.success) {
                        $http.post('/mail/forgot/password', $scope.user)
                            .success(function (response) {
                                if (response.status) {
                                    FlashService.Success(response.message, true);
                                } else {
                                    FlashService.Error(response.message);
                                }
                                $scope.dataLoading = false;
                            });
                    } else {
                        FlashService.Error(response.message);
                        $scope.dataLoading = false;
                    }
                });
        };
    }]);

    authentication.controller('ResetController', ['$scope', '$routeParams', 'FlashService', '$http', 'AuthenticationService', function ($scope, $routeParams, FlashService, $http, AuthenticationService) {
        $scope.changePasswordRequest = false;
        AuthenticationService.ClearCredentials();
        $scope.dataLoading = true;
        $http.post('/reset/validate/token', {token: $routeParams.token})
            .success(function (response) {
                if (response.status) {
                    $scope.changePasswordRequest = true;
                    $scope.changePasswordRequestToken = $routeParams.token;
                } else {
                    FlashService.Error(response.message);
                }
                $scope.dataLoading = false;
            });
    }]);

})();