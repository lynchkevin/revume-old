'use strict';

/**
* A factory to wrap pubnub   
*/

angular.module('starter.controllers')
.controller('presentationsCtrl', 
['$scope','Presentation',function ($scope,Presentation) {
        $scope.presentations = Presentation.query();
}])
.controller('presentationCtrl', 
['$scope', '$timeout', '$stateParams','Presentation','userService','pnFactory',function ($scope,$timeout,$stateParams, Presentation,userList,pnFactory) {
    //get the presentation from the server
    $scope.presentation = Presentation.get({id:$stateParams.id});
    $scope.presentation.$promise.then(function(result){
            $scope.name = result.name;
            alert($scope.name);
    });    
    
}])
.controller('presentationDeferCtrl', 
['$scope', '$rootScope', '$stateParams', '$timeout','deck','pnFactory','$ionicSlideBoxDelegate','session','userMonitor',
 function ($scope, $rootScope, $stateParams, $timeout, deck,pnFactory,sbDelegate,session, monitor) {
    // the presenation is resolved in the state router 
    $scope.presentation = deck;
    
    //open an anonymous channel for now
    // no need to calll init again - it's called when we log in
     // pnFactory.init("anonymous");    
    
    //initialize the $scope
    var current = 0;
    $scope.init = function(){
        current = 0;
        $scope.showUsers = true;
        $scope.session = session;
        monitor.init($scope.session.attendees);
        $scope.everyone=[];
        $scope.mapShowing = false;
        $scope.buttonText = "Show All"
        var channelName = $stateParams.sessionId.toString()+".view_channel";
        $scope.channel = pnFactory.newChannel(channelName);
        $scope.channel.subscribe(handleMessage,handlePresence);
        newPresentation($scope.presentation.id);
        $scope.setSlide(current);
    }

    //when done clean up
    $scope.cleanUp = function(){
        if($scope.channel != 'undefined'){
            $scope.channel.unsubscribe();
        }
    };
     
    //toggle show users
    $scope.toggleShowUsers = function(){
        $scope.showUsers = !$scope.showUsers;
    }
    
    //helper functions
    function newPresentation(id){
        $scope.channel.publish({
            cmd:"new",
            value: id});
    };      

    function handlePresence(m){
        $scope.channel.resolveUsers(m); //resolve who's online
        monitor.rollCall($scope.channel.users); //take a rollcall based on whos online
        var statusMessage = m.uuid.replace(/_/g, " ") +" has ";
        switch(m.action){
            case "join" : 
                statusMessage = statusMessage+"joined";
                break;
            case "leave":
            case "timeout":
                statusMessage = statusMessage+"left";
                break;
        }
        $timeout(function(){
            $scope.everyone = monitor.everyone;
            $scope.$broadcast("show_message", statusMessage);
        },0);
        console.log($scope.everyone);
    }
     
    function handleMessage(msg){
        switch(msg.cmd){
            case 'engagement':
                var str = msg.who + " is " + msg.status;
                monitor.noteEngagement(msg.who,msg.status);
                $timeout(function(){
                    $scope.everyone = monitor.everyone;
                },0);
                break;
        }
    };
      
    $scope.toggleMap = function(){
        $scope.mapShowing = !$scope.mapShowing;
        $scope.buttonText = $scope.mapShowing ? "Hide All" : "Show All";
    };
      
    
    $scope.nextSlide = function() {
        $scope.setSlide(++current);
        sbDelegate.slide(current);
        sbDelegate.update();
    };
    
    $scope.prevSlide = function() {
        $scope.setSlide(--current);
        sbDelegate.slide(current);
        sbDelegate.update();
    };
      
    $scope.setSlide = function(slideNumber) {
        if(slideNumber >= $scope.presentation.slides.length-1) {
            current = $scope.presentation.slides.length-1;
            $scope.nextEnabled = false;
            $scope.prevEnabled = true;
        } else if(slideNumber <= 0) {
            current = 0;
            $scope.prevEnabled = false;
            $scope.nextEnabled = true;
        } else {   
            current = slideNumber;
            $scope.nextEnabled = true;
            $scope.prevEnabled = true;
        }
        $scope.viewingSlide = $scope.presentation.slides[current];
        //tell the viewers to update their slide
        var val = current.toString();
        $scope.channel.publish({
            cmd:"set",
            value: val});  
        $scope.$broadcast("slideChange",val);
    };
    
    $scope.viewIdx = function() {
        return current;
    };
      
    $scope.$on('$destroy', function(){
        $scope.cleanUp();
    });
    $scope.$on('$locationChangeStart', function(){
        $scope.cleanUp();
    });      
    // everything is defined - let's init
    $scope.init();
}]);
    
 



              
