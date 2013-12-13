describe('author.component-name', function() {


    beforeEach(module('tree.default-model', function($provide) {
        $provide.value('$window', {
            alert: jasmine.createSpy('alert')
        });
    }));

    it('should have thingService', function() {
        inject(function(thingService) {
            expect(thingService).toBeDefined();
        });
    });

    describe('thingService', function() {

        var thingService;

        beforeEach(inject(function(_thingService_) {
            thingService = _thingService_;
        }));

        it('should be an object', function() {
            expect(typeof thingService).toBe('object');
        });

        it('should have a method sayHello()', function() {
            expect(thingService.sayHello).toBeDefined();
        });

        describe('sayHello()', function() {

            it('should be a function', function() {
                expect(typeof thingService.sayHello).toBe('function');
            });

            it('should return a string', function() {
                expect(typeof thingService.sayHello()).toBe('string');
            });

            it('should return \'Hello!\'', function() {
                expect(thingService.sayHello()).toEqual('Hello!');
            });
        });
    });

    describe('treeDefaultModel', function() {
        var element;
        var $scope;
        var modelValue = 'Hello';


        beforeEach(inject(function ($compile, $rootScope) {
            $scope  = $rootScope;
            element = angular.element("<textarea tree-default-model='modelValue' ng-model='modelValue'></textarea>");

            $scope.modelValue = modelValue;

            $compile(element)($scope);
            $scope.$digest();
        }));

         it('should empty the model on click on the element', function ($window) {
            element.click();

            $scope.$digest();

            expect($scope.modelValue).toBe('');
        });


        it('should empty the model on click on the element',inject(function ($window) {
            element.click();
            $scope.$digest();

            expect($scope.modelValue).toBe('');
        }));

        it('should refill model on blur if current value is empty',inject(function ($window) {
            element.click();
            $scope.$digest();

            element.blur();
            $scope.$digest();

            expect($scope.modelValue).toBe(modelValue);
        }));

        it('should not refill model on blur if current value is not empty',inject(function ($window) {
            var userInput = 'hal hal';

            element.click();
            $scope.$digest();

            element.val(userInput);
            $scope.$digest();

            element.blur();
            $scope.$digest();

            expect($scope.modelValue).not.toBe(modelValue);

        }));


    });
});
