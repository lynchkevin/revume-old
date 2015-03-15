'use strict';

/**
* A factory to wrap pubnub   
*/
angular.module('starter.services')
    .service('userService', ['$http','$window','baseUrl','pnFactory', function ($http, $window, baseUrl,pnFactory) {

    this.assignUser = function() {
        var url = baseUrl.endpoint+'/api/user';
        var promise = $http.get(url).then(
            function(resp) {
                console.log('Success',resp);
                var user = resp.data;
                var uuid = user.firstName+"_"+user.lastName;  
                pnFactory.init(uuid);
                return uuid;
            });
        return promise;
    };

}])

    .service('userMonitor', ['$rootScope', function ($rootScope) {
    
    this.invited = []; // these are in the session - firstname, lastname
    this.present = []; // this is just a uuid firstname_lastname
    this.everyone = []; // add crashers to the list
    
    this.init = function(attendees){
        this.invited = attendees;
    };
        
    this.rollCall = function(online){
        var e = [];
        var intruders = online.slice(0);
        this.present = online;
        for(var i=0; i < this.invited.length; i++){
            var uuid = this.invited[i].firstName+"_"+this.invited[i].lastName;
            if(uuid == $rootScope.userId){
                this.invited[i].itsMe = true;
            }else{
                this.invited[i].itsme = false;
            }
            this.invited[i].uuid = uuid;
            this.invited[i].isOnline = false;
            for(var j=0; j<intruders.length; j++){
             if(uuid == intruders[j]){
                this.invited[i].isOnline = true;
                intruders.splice(j,1);
                }
            }
            e.push(this.invited[i]);
        };
        //all invited users have been checked for online status
        //if intruders has anyone left let's mark them as such
        for(i=0; i<intruders.length; i++){
            var underscore = intruders[i].indexOf("_");
            var first = intruders[i].substring(0,underscore);
            var last = intruders[i].substring(underscore+1,intruders[i].length);
            var m = {firstName:first, lastName:last, uuid:intruders[i], isOnline:true, unInvited:true};
            e.push(m);
        }
        this.everyone = e;
    };
    
    this.noteEngagement = function(uuid,status){
        for(var i = 0; i < this.everyone.length; i++){
            if(this.everyone[i].uuid == uuid){
                if(status == 'distracted'){
                    this.everyone[i].distracted = true;
                }else{
                    this.everyone[i].distracted = false;
                };
                
            }
        }
    };
                                        

}]);
