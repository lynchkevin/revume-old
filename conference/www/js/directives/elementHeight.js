'use strict';

/**
* date-picker directive to interface with Jquery Plugin   
*/

angular.module('starter.directives')
    .directive('elemHeight', ['$window','$timeout',function ($window, $timeout) {
      return {
          restrict : 'A',
          link : function(scope, element, attrs){
            var w = angular.element($window);
            var el = element[0];
            var targetHeight = attrs.elemHeight;              
            var height = verge.viewportH() * targetHeight;
            var heightStr = height.toString()+"px";
            el.style.height = heightStr;
          }
        }
}]);