angular

    .module('tree.default-model', ['ng'])

    .factory('thingService', function () {
        return {
            sayHello: function () {
                return 'Hello!';
            }
        };
    })

    .directive('treeDefaultModel', ['$window', function ($window) {
        return {
            restrict: 'A',
            scope : {
                treeDefaultModel : '='
            },
            link: function (scope, element, attrs) {
                var defaultModel = scope.treeDefaultModel;

                element.bind('click', function (e) {
                    e.preventDefault();
                    scope.treeDefaultModel = '';
                });

                element.bind('blur', function (e) {
                    if(element.val() === '') {
                        scope.treeDefaultModel = defaultModel;
                    }
                });
            }
        };
    }]);
