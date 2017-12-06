(function() {
    'use strict';
    var profile = angular.module('Profile');

    profile.controller('ProfileController', ['$scope', 'FileUploader', 'FlashService', '$location', '$http', function($scope, FileUploader, FlashService, $location, $http) {

        $scope.showProfileUploader = false;

        $http.post('/profile').then(function(response) {
            if (response.data.success) {
                $location.path('/home');
            } else {
                $scope.showProfileUploader = true;
            }
        });

        $scope.dataLoading = true;

        var uploader = $scope.uploader = new FileUploader({
            url: '/upload/profile/detail'
        });

        // FILTERS
        uploader.filters.push({
            name: 'imageFilter',
            fn: function(item /*{File|FileLikeObject}*/ , options) {
                var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
                return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
            }
        });

        // CALLBACKS
        uploader.onAfterAddingAll = function(addedFileItems) {
            if (uploader.getNotUploadedItems().length > 1) {
                uploader.removeFromQueue(0);
            }
        };

        uploader.onBeforeUploadItem = function(fileItem) {
            fileItem.formData.push({
                phone: $scope.number,
                interest: $scope.interest
            });
        };

        uploader.onSuccessItem = function(fileItem, response, status, headers) {
            if (response.success) {
                $location.path('/home');
            } else {
                $scope.error = response.message;
                $scope.dataLoading = false;
            }
        };

        uploader.onErrorItem = function(fileItem, response, status, headers) {
            console.info('onErrorItem', fileItem, response, status, headers);
        };

    }]);

    profile.controller('HomeController', ['$scope', 'socketFac','$window','UserService', function($scope, socketFac,$window,UserService) {

        $scope.newCustomers = [];
        $scope.currentCustomer = {};

        UserService.getById($window.sessionStorage.getItem("user_id"))
        .then(function (response) {
            if (response.success) {
                $scope.chatUsername = response.data[0].first_name +' '+response.data[0].last_name;
            }
        });


        $scope.send = function() {
            socket.emit('add-customer', $scope.currentCustomer);
            $scope.currentCustomer.name = "";
        };

        socket.on('notification', function(data) {
            $scope.$apply(function() {
                $scope.newCustomers.push(data.customer);
            });
        });

    }]);

})();