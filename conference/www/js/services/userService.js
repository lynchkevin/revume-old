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

}]);
              
