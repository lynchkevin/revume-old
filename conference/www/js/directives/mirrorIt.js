'use strict';

/**
* date-picker directive to interface with Jquery Plugin   
*/

angular.module('starter.directives')
    .directive('mirrorIt', ['pnFactory','$stateParams','$window','$timeout',function (pnFactory,$stateParams,$window, $timeout) {
      return {
          restrict : 'A',
          link : function(scope, element, attrs){
            var w = angular.element($window);
            var el = element[0];
            var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
            var dom = el.contentWindow.document;
            var observer = {};
            var initialized = false;
            var mirrorClient = {};
            
            // use a channel to communicate the changes
            //scope.channelName=$stateParams.sessionId.toString()+".webActions";
            scope.channelName = "webActions";
            var channel = pnFactory.newChannel(scope.channelName);
              
            //cleanup on close
            scope.$on('$destroy',function() {
               if(channel != undefined){
                channel.unsubscribe();
               };
            });
            
            scope.$on('$locationChangeStart', function(){
                if(channel != undefined){
                    channel.unsubscribe();
                    channel == undefined;
                };
            });
                      
            function createMirrorClient(){
            
                mirrorClient = new TreeMirrorClient(dom, {
                  initialize: function(rootId, children) {
                    var i = {   f: 'initialize',
                                args: [rootId, children]
                            };
                    console.log(i);
                    channel.publish(i);
                  },

                  applyChanged: function(removed, addedOrMoved, attributes, text) {
                    var a = {   f: 'applyChanged',
                                args: [removed, addedOrMoved, attributes, text]
                            };
                      console.log(a);
                      channel.publish({ f: 'applyChanged',
                                        args: [removed, addedOrMoved, attributes, text]});
                  }
                });
            };
            el.addEventListener('load', function(){
                    dom = el.contentWindow.document;
                    createMirrorClient();
            });
          
        }                    
    }
          
}]);

/*
            var observer = new MutationObserver(function(mutations) {
                 mutations.forEach(function(mutation) {
                   for (var i = 0; i < mutation.addedNodes.length; i++)
                     insertedNodes.push(mutation.addedNodes[i]);
                 })
                console.log(insertedNodes);
            });
*/

/* this works
            function createMutationObserver(){
                observer = new MutationObserver(function(mutations) {
                    console.log(mutations);
                });
                var config = {
                    attributes: true,
                    childList: true,
                    characterData: true,
                    subtree: true
                };
                observer.observe(dom, config);
            };
              
            el.addEventListener('load', function(){
                if(!initialized){
                    dom = el.contentWindow.document;
                    createMutationObserver();
                    initialized = true;
                };
            });
*/