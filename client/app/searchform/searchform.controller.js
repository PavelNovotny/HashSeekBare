(function () {
    'use strict';

    var searchform= angular.module('app')
        .controller('SearchFormCtrl', ['$scope', '$http', '$httpParamSerializer', 'Data', SearchFormCtrl])
        .controller('DatepickerCtrl', ['$scope',  'Data', DatepickerCtrl])
    ;

    searchform.factory('Data', function () {
        return { dt: null };
    });


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

    function SearchFormCtrl($scope, $http, $httpParamSerializer, Data) {

        $scope.seekStrings = [['', '', '']];

        $scope.searchDays={
            days:1,
            daysTen:0,
            daysTotal:1
        };

        $scope.env={
            systest:false,
            predprod:true,
            prod: false
        };

        $scope.logs={
            audit: true,
            time: false
        };
        
        $scope.servers={
            esb: true,
            b2b: false,
            bpm: false
        };
        
        $scope.lastlogs = false;


        $scope.changed = function(index) {
            if ($scope.seekStrings[index][0]
                || $scope.seekStrings[index][1]
                || $scope.seekStrings[index][2]) {
                if (index === $scope.seekStrings.length-1) {
                    var newItemNo = $scope.seekStrings.length;
                    $scope.seekStrings.push(['', '', '']);
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

        $scope.createArray = function(booleanObject) {
            var result = [];
            for (var key in booleanObject) {
                if (booleanObject[key]) {
                    result.push(key);
                }
            }
            return result;
        }

        $scope.search = function() {
            var data = {
                seekStrings: $scope.seekStrings,
                date: Data.dt,
                searchDays: $scope.searchDays.daysTotal,
                env : $scope.createArray($scope.env),
                logs : $scope.createArray($scope.logs),
                servers : $scope.createArray($scope.servers),
                last : $scope.lastlogs
            };
            $http.post('/api/search', data)
                .success(function (data) {
                    $scope.searchResult = data;
                    console.log(data);
                })
                .error(function (data) {
                    console.log('Error: ' + data);
                });
        };


    }

    function DatepickerCtrl($scope, Data) {

        $scope.Data = Data;

        $scope.today = function() {
            return $scope.Data.dt = new Date();
        };

        $scope.today();

        $scope.showWeeks = true;

        $scope.toggleWeeks = function() {
            $scope.showWeeks = !$scope.showWeeks;
        };

        $scope.clear = function() {
            $scope.Data.dt = null;
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
