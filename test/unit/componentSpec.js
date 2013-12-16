describe('author.component-name', function() {

    beforeEach(module('tree.default-model'));

    describe('treeDefaultModel Directive', function() {


        var $scope;
        var $compile;

        var markup = "<input type='text' tree-default-model='defaultModelValue' ng-model='modelValue'>";
        var element;
        var defaultModelValue = 'Hello World!';

        var compileElement = function (markup, scope) {
            var el = $compile(markup)(scope);
            scope.$digest();
            return el;
        };

        beforeEach(inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $scope   = _$rootScope_;

            $scope.defaultModelValue = defaultModelValue;
            $scope.modelValue = defaultModelValue;
            element = compileElement(markup, $scope);
        }));


        it('should works', function () {
            expect(element.val()).toBe(defaultModelValue);
        });

        it('should empty ngModel on click if current ngModel is equal to defaultModel', function () {
            element.click();
            expect(element.val()).toBe('');
        });

        it('should NOT empty ngModel on click if current ngModel is NOT equal to defaultModel', function () {
            var newModelValue = 'Foo';

            $scope.modelValue = newModelValue;
            $scope.$digest();
            element.click();
            expect(element.val()).toBe(newModelValue);
        });

        it('should refill with defaultModel on blur if current ngModel is empty' , function () {
            element.click();
            expect(element.val()).toBe('');

            element.blur();
            expect(element.val()).toBe(defaultModelValue);
        });

        it('should NOT refill with defaultModel on blur if current ngModel is empty' , function () {
            var newModelValue = 'Foo';

            element.click();
            expect(element.val()).toBe('');

            $scope.modelValue = newModelValue;
            $scope.$digest();
            expect(element.val()).toBe(newModelValue);

            element.blur();
            expect(element.val()).toBe(newModelValue);
        });

        it('should refill with the new dafaultModel if current ngModel is empty' , function (){
            $scope.defaultModelValue = 'Sucker!';
            $scope.$digest();

            expect(element.val()).toBe($scope.defaultModelValue);
        });

        it('should refill with the new dafaultModel if current ngModel is empty2' , function (){
            var newDefaultModelValue = 'Sucker!';
            var newModelValue = 'Bar';

            $scope.modelValue = newModelValue;
            $scope.defaultModelValue = newDefaultModelValue;
            $scope.$digest();
            expect(element.val()).toBe(newModelValue);

            $scope.modelValue = '';
            $scope.$digest();
            expect(element.val()).toBe('');

            element.blur();
            expect(element.val()).toBe(newDefaultModelValue);
            expect($scope.modelValue).toBe(newDefaultModelValue);
        });

        it('should NOT refill with the new dafaultModelValue if current model value is NOT empty' , function (){
            var newDefaultModelValue = 'Sucker!';
            var newModelValue = 'Bar';

            $scope.modelValue = newModelValue;
            $scope.defaultModelValue = newDefaultModelValue;
            $scope.$digest();
            expect(element.val()).toBe(newModelValue);
        });


    });
});
