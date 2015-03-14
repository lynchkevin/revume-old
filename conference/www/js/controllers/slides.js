'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:SlideCtrl
 * @description
 * # SlideCtrl
 * Controller of the barebonesApp to Browse Slide Thumbnails
 */
angular.module('barebonesApp')
  .controller('SlideCtrl', ['$scope', '$location', 'pnFactory', 'userService','presentationService', function ($scope, $location, pnFactory, userList, presentService) {
  
    var BASEFILENAME = "img/Slide";
    var filename = "";
    var current = 0;  
    var userID = "anonymous"      
  

    userList.assignUser().then(function(userID) {
        pnFactory.init(userID);        
        $scope.init();   
    },function(err){
        console.log(err);
    });
      
    $scope.init = function() {
        presentService.getPresentation().then(function(pres) {
            $scope.presentation = pres;
            current = 0;
            $scope.mapShowing = false;
            $scope.buttonText = "Show All"
            $scope.channel = pnFactory.newChannel("view_channel");
            $scope.channel.hereNow(handleHereNow);
            $scope.channel.subscribe("",handlePresence);
            newPresentation();
            $scope.setSlide(current);
        },function(err){
            console.log(err);
        });
    };
      
    $scope.cleanUp = function(){
        if($scope.channel != 'undefined'){
            $scope.channel.unsubscribe();
        }
    };
      
    function newPresentation(){
        $scope.channel.publish("newPresentation");
    };
      
    function handleHereNow(m){
        console.log(m);
    };

    function handlePresence(m){
        $scope.channel.hereNow(handleHereNow);
    }
      
    $scope.toggleMap = function(){
        $scope.mapShowing = !$scope.mapShowing;
        $scope.buttonText = $scope.mapShowing ? "Hide All" : "Show All";
    };
      
    
    $scope.nextSlide = function() {
        $scope.setSlide(++current);
    };
    
    $scope.prevSlide = function() {
        $scope.setSlide(--current);
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
        var msg = current.toString();
        console.log(msg);
        console.log($scope.channel);
        $scope.channel.publish(msg);     
    };
    
    $scope.viewIdx = function() {
        return current;
    };
      
    $scope.backButton = function(){
        $location.path('/pres');
    }
    
    $scope.$on('$destroy', function(){
        $scope.cleanUp();
    });
    $scope.$on('$locationChangeStart', function(){
        $scope.cleanUp();
    });  

    
  }]);
