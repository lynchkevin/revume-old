'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the barebonesApp
 */
angular.module('barebonesApp')
  .controller('MainCtrl', ['$scope', '$rootScope', function ($scope) {
    
    $scope.setAppt = function() {
        var startTime = new Date(Date.parse($scope.form.dateStr));
        var endTime = new Date(startTime.getTime());
        var startStr = "";
        var endStr = "";
        var cal = ics();
        
        startStr = startTime.toString();
        endTime.setHours(startTime.getHours()+2);
        endStr = endTime.toString();

        var event = cal.addEvent('Test Appointment', 
                     'See if this appointment works!',
                     'On Line',
                     startStr,
                     endStr);
        cal.download();
    };
  }]);
