'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:pubnubCtrl
 * @description
 * # SlideCtrl
 * Controller of the barebonesApp to interface to pubnub
 */
angular.module('barebonesApp')
  .controller('pubnubCtrl', ['$scope','$http', function ($scope,$http) {
        
    // get a unique user from the server
    $http.get('http://192.168.1.116:3000/user').then(
    function(resp) {
        console.log('Success',resp);
        $scope.user = resp.data;
        $scope.uuid = $scope.user.firstName+"_"+$scope.user.lastName;  
        $scope.pubnub = PUBNUB.init( {
            publish_key: 'pub-c-19a2e5ee-5b70-435d-9099-65ae53e5b149',
            subscribe_key: 'sub-c-0f2a418a-b9f1-11e4-80fe-02ee2ddab7fe',
            uuid:$scope.uuid
        });    
    }, 
    function(err) {
        console.log('Err', err);
        $scope.uuid = "anonymous";
        $scope.pubnub = PUBNUB.init( {
            publish_key: 'pub-c-19a2e5ee-5b70-435d-9099-65ae53e5b149',
            subscribe_key: 'sub-c-0f2a418a-b9f1-11e4-80fe-02ee2ddab7fe',
        uuid:$scope.uuid
        });        

    });
    
      

    $scope.init = function(){
        $scope.status = "Unsubscribed";
        $scope.message = "";
        $scope.count = 0;
        $scope.channel = "Kevins Channel";
        $scope.event = new Object();
        $scope.event.uuid = "";
        $scope.event.action = "";
        $scope.event.occupancy = 0;
    };
      
    $scope.doTime = function() {
        $scope.pubnub.time( 
            function(time){
                console.log(time);
            }
        );
    };
    $scope.presenceEvent = function(m) {
        $scope.$apply(function() {
            $scope.event.uuid = m.uuid;
            $scope.event.action = m.action;
            $scope.event.occupancy = m.occupancy;
        });
    }
      
    $scope.subscribe = function() {
        $scope.pubnub.subscribe({
            channel: $scope.channel,
            presence: function(m){console.log(m);$scope.presenceEvent(m);}, 
            message: function(m){
                console.log(m);
                $scope.$apply(function() {
                    $scope.message = m;
                });
            },
            heartbeat:30
        });
        $scope.status="Subscribed to "+$scope.channel;
    };
      
    $scope.publish = function() {
        $scope.count++;
        var msg = "Hello from pubnub! count is "+$scope.count.toString();
        $scope.pubnub.publish({
            channel: $scope.channel,
            message: msg
        });
    };

    $scope.unsubscribe = function() {
        $scope.pubnub.unsubscribe({
            channel: $scope.channel,
        });
        $scope.status = "Unsubscribed";
        $scope.init();
    };
      
    $scope.init();
      
    $scope.$on('$destroy', function(){
        $scope.unsubscribe();
    });
      
  }]);
