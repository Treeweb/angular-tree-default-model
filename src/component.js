
angular

    .module('tree.default-model', ['ng'])

    .directive('treeDefaultModel', [function () {

        return {
            require : 'ngModel',
            restrict: 'A',
            scope : {
                treeDefaultModel : '=',
                ngModel : '='
            },
            link: function (scope, element) {
                var defaultModel = scope.treeDefaultModel;
                var empty = scope.treeDefaultModelEmptyValue || '';

                scope.$watch('treeDefaultModel' , function (newVal, oldVal){
                    if(!angular.isUndefined(newVal)) {

                        if(defaultModel === scope.ngModel) {
                            defaultModel = newVal;
                            scope.ngModel = defaultModel;
                        }else {
                            defaultModel = newVal;
                        }
                    }
                });

                element.bind('click', function (e) {
                    scope.$apply(function () {

                        e.preventDefault();

                        if(scope.ngModel === scope.treeDefaultModel) {
                            scope.ngModel = empty;
                        }
                    });
                });

                element.bind('blur', function (e) {
                    scope.$apply(function () {

                        e.preventDefault();

                        if(scope.ngModel === empty) {
                            scope.ngModel = defaultModel;
                        }

                    });
                });
            }
        };
    }]);
