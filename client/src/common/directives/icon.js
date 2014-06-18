angular.module('directives.icon', [
	'ui.bootstrap',
	'services.directiveInitializer'
])

// A directive for icon (any icon should used be done via this directive)
.directive('icon', [
	function() {
		return {
			restrict: 'E',
			templateUrl: 'directives/icon.tpl.html',
			replace: true,
			transclude: true,
			scope: {
				id: '@',
				flip: '@?',
				invert: '@?'
			},
			controller: [
				'$scope',
				'$element',
				'$attrs',
				'directiveInitializer',
				function ($scope, $element, $attrs, directiveInitializer) {

 					$scope.self = {};
					var attrsData = {
						attrs: $attrs,
						interpolationKeys: [
							'id',
							'flip',
							'invert'
						],
						booleanKeys: [
							'flip',
							'invert'
						],
						attrDefaults: {
							// flip: false
						}
					};

					// setup the directive model based on interpolation and expression attributes
					directiveInitializer.init($scope, $scope.self, attrsData);
					// console.log("icon scope.self");
					// console.log($scope.self);

				}
			]
		};
	}
])
