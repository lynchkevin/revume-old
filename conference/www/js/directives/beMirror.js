'use strict';

/**
* date-picker directive to interface with Jquery Plugin   
*/

angular.module('starter.directives')
    .directive('beMirror', ['pnFactory','$stateParams','$window','$timeout',function (pnFactory,$stateParams,$window, $timeout) {
      return {
          restrict : 'A',
          link : function(scope, element, attrs){
            var w = angular.element($window);
            var el = element[0];
            var dom = el.contentWindow.document.body;
            var base;
              
            // use a channel to communicate the changes
            //scope.channelName=$stateParams.sessionId.toString()+".webActions";
            scope.channelName = "webActions";
            var channel = pnFactory.newChannel(scope.channelName);
        
            var mirror = new TreeMirror(dom, {
                createElement: function(tagName) {
                  if (tagName == 'SCRIPT') {
                    var node = document.createElement('NO-SCRIPT');
                    node.style.display = 'none';
                    return node;
                  }

                  if (tagName == 'HEAD') {
                    var node = document.createElement('HEAD');
                    node.appendChild(document.createElement('BASE'));
                    node.firstChild.href = base;
                    return node;
                  }
                }
            });

            function handleMessage(msg){
                console.log(msg);
                return;
            if (msg.base)
                base = msg.base;
            else
                mirror[msg.f].apply(mirror, msg.args);
            };
              
            channel.subscribe(handleMessage);
              
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