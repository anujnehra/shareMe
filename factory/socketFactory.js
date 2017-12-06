'use strict';

var socketFactory = angular.module('shareMe');

socketFactory.factory('socketFac', ['$rootScope', function ($rootScope,) {
    return {
        on: function(eventName, callback){
            socket.on(eventName, callback);
        },
        emit: function(eventName, data) {
            socket.emit(eventName, data);
        }
    };
}]);