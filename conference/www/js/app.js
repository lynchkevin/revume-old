// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', 
[   'ionic',
    'ngResource',
    'ngAnimate',
    'starter.directives',
    'starter.services',
    'starter.controllers'
]
)

.constant("baseUrl",{"endpoint": "http://192.168.1.116:5000"})
.run(["$ionicPlatform","$rootScope","$window","userService","pnFactory",function($ionicPlatform,$rootScope,$window,userList,pnFactory) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
    //get a userID then call init...
    if($rootScope.userId == undefined){
        userList.assignUser().then(function(userID) {
            $rootScope.userId = userID;   
            //manage user presence on the rootScope so all controllers can use
            $rootScope.mHandler = function(message){
                console.log("message from presence service",message);
            };
            $rootScope.pHandler = function(message){
                $rootScope.users = $rootScope.mainChannel.resolveUsers(message);
                console.log("got a status message", message);
                $rootScope.$broadcast("presence_change");
            }
            pnFactory.init(userID);
            $rootScope.mainChannel = pnFactory.newChannel("volerro_user");
            $rootScope.mainChannel.subscribe($rootScope.mHandler,
                                         $rootScope.pHandler);
            
        },function(err){
            console.log(err);
        });
    };
    
    $window.addEventListener("beforeunload", function (e) {
        $rootScope.mainChannel.unsubscribe();

      //(e || $window.event).returnValue = null;
      return null;
    });

         
}])

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })
  
  .state('app.welcome', {
    url: "/welcome",
    views: {
      'menuContent': {
        templateUrl: "templates/splash.html",
        controller: 'splashCtrl'
      }
    }
  })
  .state('app.testLead', {
    url: "/testLead/:id?sessionId",
    views: {
      'menuContent': {
        templateUrl: "templates/testLead.html"
      }
    }
  })
  
  .state('app.testFollow', {
    url: "/testFollow/:id?sessionId",
    views: {
      'menuContent': {
        templateUrl: "templates/testFollow.html"
      }
    }
  })

  .state('app.viewer', {
    url: "/viewer/:id?sessionId",
    views: {
      'menuContent': {
        templateUrl: "templates/viewer.html",
        controller: 'ViewCtrl'
      }
    }
  })
    .state('app.viewerSessions', {
    url: "/viewerSessions",
    views: {
      'menuContent': {
        templateUrl: "templates/sessionsForViewer.html",
        controller: 'SessionsCtrl'
      }
    }
  })
    .state('app.viewerSession', {
    url: "/viewerSessions/:sessionId",
    resolve: {
            Presentation : 'Presentation',
            decks: function(Presentation){

                // Return a promise to make sure the customer is completely
                // resolved before the controller is instantiated
                return Presentation.query().$promise;
            }
        },
    views: {
        'menuContent': {
          templateUrl: "templates/sessionForViewer.html",
          controller: 'SessionDeferCtrl'
      }
    },
})
    .state('app.sessions', {
      url: "/sessions",
      views: {
          'menuContent': {
              templateUrl: "templates/sessions.html",
              controller: 'SessionsCtrl'
          }
      }
    })
  
    .state('app.session', {
    url: "/sessions/:sessionId",
    resolve: {
            Presentation : 'Presentation',
            decks: function(Presentation){

                // Return a promise to make sure the presentation is completely
                // resolved before the controller is instantiated
                return Presentation.query().$promise;
            } 
        },
    views: {
        'menuContent': {
          templateUrl: "templates/session.html",
          controller: 'SessionDeferCtrl'
      }
    },
})
  
  
    .state('app.presentations', {
      url: "/presentations",
      views: {
          'menuContent': {
              templateUrl: "templates/presentations.html",
              controller: 'presentationsCtrl'
          }
      }
      
    })
    .state('app.presentation', {
    url: "/presentations/:id?sessionId",
    resolve: {
            Presentation : 'Presentation',
            deck: function(Presentation, $stateParams){

                // Return a promise to make sure the customer is completely
                // resolved before the controller is instantiated
                return Presentation.get({id:$stateParams.id}).$promise;
            },
            session : function(Session,$stateParams) {
                //hack the id from the idString
                var id = parseInt($stateParams.sessionId[0])
                id = id-1;
                return Session.get({sessionId: id}).$promise;
            }   
        },
    views: {
        'menuContent': {
        templateUrl: "templates/presentation.html",
        controller : 'presentationDeferCtrl'    
      }
     }
  
    })
    
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/welcome');
});
