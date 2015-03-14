'use strict';

/**
 * @ngdoc function
 * @name barebonesApp.controller:SlideCtrl
 * @description
 * # presenceService
 * service to handle presence for the app
 */
angular.module('starter')
  .service('presenceService', ['pnFactory', function (pnFactory) {
      
    var channel;
    var onChangeCallback = function(){};
    var users = [];
      
    this.join = function(uuid,mCallback,pCallback) {
        var noop = function(){};
        var mcb = mCallback || noop;
        onChangeCallback = pCallback || noop;
        pnFactory.init(uuid);        
        channel = pnFactory.newChannel("volerro_user");
        channel.subscribe(mcb,presenceHandler);
    };    
  
    this.leave = function(){
        if(channel != undefined) {
            channel.unsubscribe();
        };
        console.log("presence service - leave");
    };
    
    this.hereNow = function(hnCallback){
        var noop = function(){};
        var hncb = hnCallback || noop;
        channel.hereNow(hncb);
    };
                
    var presenceHandler = function(message) { 
        switch(message.action) {
            case "join": 
                users.push(message.uuid); 
                break;
            case "leave":
                console.log("presence got leave action!");
            case "timeout":
                users.splice(users.indexOf(message.uuid), 1); 
                break;
        }
        var status = {m:message, present:users};
        onChangeCallback(status);

    }
        
        
      
  }]);
