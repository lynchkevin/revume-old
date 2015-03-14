'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the barebonesApp
 */
angular.module('starter')
  .controller('splashCtrl', ['$scope', '$rootScope','$timeout', function ($scope,$rootScope,$timeout) {
      
    $timeout(function(){
        $scope.userId = $rootScope.userId;
        $scope.users = $rootScope.users;
    },0);
      
    $scope.$on("presence_change",function(){
        $scope.$apply(function(){
            $scope.users = $rootScope.users;
        });
    });
    
  }]);
