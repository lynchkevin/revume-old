'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:SlideCtrl
 * @description
 * # SlideCtrl
 * Controller of the barebonesApp to Browse Slide Thumbnails
 */
angular.module('starter.controllers')
  .controller('ViewCtrl', ['$scope',
                           '$rootScope',
                           '$stateParams',
                           '$timeout',
                           '$window',
                           'pnFactory',
                           'userService',
                           'Presentation',
                           '$ionicSlideBoxDelegate',function ($scope, $rootScope, $stateParams, $timeout, $window, pnFactory, userList, Presentation,sbDelegate) {
  

    var filename = "";
    var current = 0;
    var userId = $rootScope.userId;
    
 
    //call this then wait for presentation commands from leader
    $scope.init = function() {
        var channelName = $stateParams.sessionId.toString()+".view_channel";
        $scope.channel = pnFactory.newChannel(channelName);
        // subscribe and wait for presentation and slide number...
        $scope.channel.subscribe(handleMessage,handlePresence);
        $scope.name = "waiting....";
        //catch up if I joined late
        newPresentation($stateParams.id);
    };
                               
    //this disables the swipe for the follower    
    //sbDelegate.stop();
  
    
    $scope.cleanUp = function(){
        $scope.channel.unsubscribe();
    };
      
    function newPresentation(id){
        $scope.presentation = Presentation.get({id:id});
        $scope.presentation.$promise.then(function(result){
            $timeout(function(){
                $scope.name = result.name;
                $scope.presentation = result;
                current = 0;
                $scope.setSlide(current);
                sbDelegate.update();
            });
        });
    };
      
    function handleMessage(m) {
        switch(m.cmd){
            case "new" : 
                newPresentation(m.value);
                $scope.$apply(function(){
                    $scope.name = $scope.presentation.name;
                });
                break;
            case "set" : 
                $scope.$apply(function(){
                    // keep hammering the name until it takes
                    $scope.name = $scope.presentation.name;
                    $scope.setSlide(m.value);
                });
                break;
            default: break;
        }
    };
 
    function handleHistory(hArray) {
        console.log(hArray);
        for(i = 0; i<hArray.length; i++){
            handleMessage(hArray[i]);
        }
    };      
                               
    
    function handlePresence(m){
        $scope.channel.resolveUsers(m);
        var statusMessage = m.uuid+" has ";
        switch(m.action){
            case "join" : 
                statusMessage = statusMessage+"joined";
                break;
            case "leave":
            case "timeout":
                statusMessage = statusMessage+"left";
                break;
        }
        $scope.$broadcast("show_message", statusMessage);
    }
      
    $scope.nextSlide = function() {
        $scope.setSlide(++current);
    };
    
    $scope.prevSlide = function() {
        $scope.setSlide(--current);
    };
      
    $scope.setSlide = function(slideNumber) {
        current = slideNumber;
        $scope.viewingSlide = $scope.presentation.slides[current];
        sbDelegate.slide(current);
    };
    

    //handle focus events
    
    $scope.w = $window;
    $window.addEventListener("focus", function(event) { 
        var msg = {cmd:'engagement',
                   status: "engaged",
                   who: userId
                  };
        console.log("engaged");
        $scope.channel.publish(msg);
    }, false);

    $window.addEventListener("blur", function(event) { 
        var msg = {cmd:'engagement',
                   status: "distracted",
                   who: userId
                  };
        console.log("distracted");
        $scope.channel.publish(msg);
    }, false);
    
    
    
      
    $scope.$on('$destroy', function(){
        $scope.cleanUp();
    });
    $scope.$on('$locationChangeStart', function(){
        $scope.cleanUp();
    });

    // every is set up so lets initialize  
    $scope.init();        
  }]);
