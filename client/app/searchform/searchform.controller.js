(function () {
    'use strict';

    var searchform= angular.module('app')
        .controller('SearchFormCtrl', ['$scope', SearchFormCtrl])
        .controller('DatepickerCtrl', ['$scope', DatepickerCtrl])
    ;

    searchform.directive('pnSlider', [function() {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function(scope, element, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // Initialize slider and setup change event to enable updating the value
                jQuery(element).on('change', function(event) {
                    var a = event.value.newValue;
                    var b = event.value.oldValue;
                    var changed = !($.inArray(a[0], b) !== -1 &&
                    $.inArray(a[1], b) !== -1 &&
                    $.inArray(b[0], a) !== -1 &&
                    $.inArray(b[1], a) !== -1 &&
                    a.length === b.length);
                    if(changed ) {
                        scope.$evalAsync(setModelValue, scope);
                    }
                });

                //Read data from model into custom control
                ngModel.$render = function() {
                    jQuery(element).slider("setValue",Number(ngModel.$modelValue || 0), true, false);
                };

                setModelValue(scope);

                // Write data from control to the model
                function setModelValue(scope) {
                    var value = jQuery(element).slider("getValue");
                    ngModel.$setViewValue(value);
                }
            }
        };
    }]);

    function SearchFormCtrl($scope) {
        $scope.seekStrings = [{id: 'seekString0', first: {id:'seekString00'}
            ,second: {id:'seekString10'}
            ,third: {id:'seekString20'}}];

        $scope.changed = function(index) {
            if ($scope.seekStrings[index].first.name
                || $scope.seekStrings[index].second.name
                || $scope.seekStrings[index].third.name) {
                if (index === $scope.seekStrings.length-1) {
                    var newItemNo = $scope.seekStrings.length;
                    $scope.seekStrings.push({id: 'seekString'+newItemNo
                        ,first: {id:'seekString0'+newItemNo}
                        ,second: {id:'seekString1'+newItemNo}
                        ,third: {id:'seekString2'+newItemNo}});
                }
            } else {
                $scope.seekStrings.splice(index,1);
            }
        };

        $scope.removeSeekStringsRow = function(index) {
            if ($scope.seekStrings.length > 1) {
                $scope.seekStrings.splice(index,1);
            }
        };

        $scope.searchDays={
            days:1,
            daysTen:0,
            daysTotal:1
        };

        $scope.$watch(function() {
            return Number($scope.searchDays.days)+ Number($scope.searchDays.daysTen);
        }, function(newVal, oldVal) {
            if (Number($scope.searchDays.days)+Number($scope.searchDays.daysTen) === newVal) {
                $scope.searchDays.daysTotal = newVal;
            }
        }, true );

        $scope.$watch('searchDays.daysTotal', function(newVal, oldVal) {
            newVal = newVal || 0;
            if (oldVal != newVal) {
                $scope.searchDays.days = newVal % 10;
                $scope.searchDays.daysTen = newVal - $scope.searchDays.days;
            }
        });

    }

    function DatepickerCtrl($scope) {
        $scope.today = function() {
            return $scope.dt = new Date();
        };

        $scope.today();

        $scope.showWeeks = true;

        $scope.toggleWeeks = function() {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function() {
            $scope.dt = null;
        };

        $scope.disabled = function(date, mode) {
            mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
        };

        $scope.toggleMin = function() {
            var _ref;
            $scope.minDate = (_ref = $scope.minDate) != null ? _ref : {
                "null": new Date()
            };
        };

        $scope.toggleMin();

        $scope.open = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.opened = true;
        };

        $scope.dateOptions = {
            'year-format': "'yy'",
            'starting-day': 1
        };

        $scope.formats = ['dd-MM-yyyy','dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];

        $scope.format = $scope.formats[0];
    }


})();
