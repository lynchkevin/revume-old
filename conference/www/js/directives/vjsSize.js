'use strict';

/**
* vjs-show directive to interface with videojs library   
*/
angular.module('starter.directives')
    .directive('vjsSize',['pnFactory', function (pnFactory) {
      return {
        restrict : 'A',
        link: function(scope, element, attrs) 
        {
            //initialize the pubnub channel
            pnFactory.init();
            var channel = pnFactory.newChannel("vidActions");
            // broadcast play events to other users   
            var onPlay = function() {
                channel.publish({command:"play"});
                console.log("play!");
            };

            var onPause = function() {
                channel.publish({command:"pause"});
                console.log("pause");
            }

            var onSeeked = function() {
                var time = myPlayer.currentTime();
                channel.publish({command:"seekTo", where : time})
                console.log("seeked");
            }
            
            // get the player and connect
            myPlayer = videojs("example_video_1");
            if(attrs.vjsSize != "view_only"){
                myPlayer.on("play",onPlay);
                myPlayer.on("pause",onPause);
                myPlayer.on("seeked",onSeeked);
                myPlayer.controls(true);
            }else {
                channel.subscribe(handleAction);
                myPlayer.controls(false);
            };
             
            // views use these call backs
            var doPlay = function(){
                if(myPlayer != undefined){
                    myPlayer.play();
                }
            };

            var doPause = function(){
                if(myPlayer != undefined){
                    myPlayer.pause();
                }      
            };
            
            var doSeek = function(time){
                if(myPlayer != undefined){
                    myPlayer.currentTime(time);
                }      
            };


            var handleAction = function(action){
                switch(action.command) {
                    case "play":
                        doPlay();
                        break;
                    case "pause":
                        doPause();
                        break;
                    case "seekTo":
                        doSeek(action.where);
                        break;            
                }
            };

           scope.$on('$destroy',function() {
                if(myPlayer != undefined) myPlayer.dispose();
                if(attrs.vjsSize == "view_only") channel.unsubscribe();
            });

        }
        }; 
    }
]);