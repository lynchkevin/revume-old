'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:pubnubCtrl
 * @description
 * # SlideCtrl
 * Controller of the barebonesApp to interface to pubnub
 */
angular.module('barebonesApp')
  .controller('loginCtlr', ['$scope', '$timeout','presenceService', 'userService', function ($scope, $timeout, appPresence, userList) {
    

    $scope.msgHistory = [];
      
    $scope.init = function(){
        $scope.status = "Logged Out";
        $scope.presentUsers = [];
        $scope.occupancy = 0;
        $scope.action = "none";
        $scope.who = "nobody"
        $scope.message = {}
    };

    //get a userID then call init...
    userList.assignUser().then(function(userID) {
        $scope.userId = userID;      
        $scope.init();   
    },function(err){
        console.log(err);
    });
            
    
    $scope.login = function(){
        appPresence.join($scope.userId,onMsg, joinLeave)
        $scope.status = "Logged In";
    };
    
    $scope.logout = function(){
        appPresence.leave();
        $scope.init();
    };
    
    var joinLeave = function(status){
        $scope.$apply(function(){            
            $scope.presentUsers = status.present;
            $scope.occupancy = $scope.presentUsers.length;
            $scope.action = status.m.action;
            $scope.who = status.m.uuid;
        });
        if($scope.occupancy != status.m.occupancy){
            console.log("joinleave: occupancy mismatch - array.length = ",$scope.occupancy,"m.occ = ",status.m.occupancy);
        }
    }
      
    $scope.whoNow = function(){
        appPresence.hereNow(onHereNow);
    }
    
    var onHereNow = function(m){
        var str = JSON.stringify(m).replace(/['"]+/g, '').replace('}',' ').replace('{','');
        var split = str.split(",");
        
        $scope.$apply(function(){
            split.forEach(function(item){
                $scope.msgHistory.push(item);
            });
            $scope.hereMsg = m;
            $scope.presentUsers = m.uuids;
            $scope.occupancy = m.occupancy;
        });
    };
    
    var onPres = function(m){
        var str = JSON.stringify(m).replace(/['"]+/g, '').replace('}',' ').replace('{','');
        var split = str.split(",");
    
        $scope.$apply(function(){
            split.forEach(function(item){
                $scope.msgHistory.push(item);
            });      
            $scope.presenceMsg = m;
            $scope.action = m.action;
            $scope.who = m.uuid;
            $scope.occupancy = m.occupancy;
        });
        $timeout($scope.whoNow, 3000);

    };
    
    var onMsg = function(m){
        $scope.$apply(function(){
            $scope.m = m;
        });
    };

      
    $scope.$on('$destroy', function(){
        $scope.unsubscribe();
    });
      
  }]);
