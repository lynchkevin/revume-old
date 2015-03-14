'use strict';

/**
* vjs-show directive to interface with videojs library   
*/
angular.module('starter.directives')
    .directive('vConnect',['pnFactory', function (pnFactory) {
      return {
        restrict : 'A',
        link: function(scope, element, attrs) 
        {
            //initialize the pubnub channel
            pnFactory.init();
            var channel = pnFactory.newChannel("vidActions");
            // get the html5 video player   
            var myPlayer = element[0];
            
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
                var time = myPlayer.duration;
                channel.publish({command:"seekTo", where : time})
                console.log("seeked");
            }
            
            // check if "leader" or "follower" then drive or watch
            if(attrs.vConnect != "follower"){
                myPlayer.onplay = onPlay;
                myPlayer.onpause = onPause;
                myPlayer.onseeked = onSeeked;
                myPlayer.controls=true;
            }else {
                channel.subscribe(handleAction);
                myPlayer.controls=false;
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
                    myPlayer.currentTime = time;
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
                if(attrs.vConnect == "follower") channel.unsubscribe();
            });

        }
        }; 
    }
]);