'use strict';

/**
* date-picker directive to interface with Jquery Plugin   
*/
angular.module('barebonesApp')
  .directive('datePicker', function () {
    return {
        restrict : 'A',
        require : 'ngModel',
        link : function(scope, element, attrs, ngModel) {
            // convert the attrs string to an object
            var optionsObj = scope.$eval(attrs.datePicker);
            // add the callback to the options here rather than in the html
            optionsObj.onSelectDate = function (current, input){
                if(!today(current)) {
                    this.setOptions({minTime: false});
                } else {
                    this.setOptions({ minTime:0 });
                }
            };
            // add the callback for the close event to update angular
            optionsObj.onClose = function(current, input) {                
                scope.$apply(updateInputElement(input[0].value));
                console.log(current);
                console.log(input);
            };
            // need to manually update the input element since it was changed by jQuery
            function updateInputElement(value) {
                ngModel.$setViewValue(value);
                ngModel.$render();
            }      
            // call the pluggin activation function
            angular.element(element).datetimepicker(optionsObj);
        }
    }
  })

// convenienve function to determine if the return date is today
function today(td){
    var d = new Date();
    return td.getDate() == d.getDate() && td.getMonth() == d.getMonth() && td.getFullYear() == d.getFullYear();
};


