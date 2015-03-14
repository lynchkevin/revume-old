'use strict';

/**
* date-picker directive to interface with Jquery Plugin   
*/
angular.module('barebonesApp')
    .directive('scrollIf', function () {
      return function(scope, element, attrs) {
        scope.$watch(attrs.scrollIf, function(value) {
          if (value) {
            // Scroll to ad.
            var el = angular.element(element)[0];
            var parent = angular.element(element).parent()[0];
            var pw = parent.offsetWidth;
            var pos = el.offsetLeft;
            var w = el.offsetWidth;
            var scroll = 0;
            
           if(pos+w > pw) {
               scroll = pos;
           }   

           angular.element(element).parent().animate({
                scrollLeft : scroll
            }, 300);
          }
        });
      }
});