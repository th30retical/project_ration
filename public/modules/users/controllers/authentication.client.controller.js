'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
	function($scope, $http, $location, Authentication) {
		$scope.authentication = Authentication;

		// If user is signed in then redirect back home
		if ($scope.authentication.user) $location.path('/');

		$scope.signup = function() {
			console.log($scope.credentials);
			$http.post('/auth/signup', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.signin = function() {
			$http.post('/auth/signin', $scope.credentials).success(function(response) {
				// If successful we assign the response to the global user model
				$scope.authentication.user = response;

				// And redirect to the index page
				$location.path('/');
			}).error(function(response) {
				$scope.error = response.message;
			});
		};

		$scope.clickme = function(m)  {
			if (m === 'donor'){
				document.querySelector('.donor').setAttribute('checked','checked');
				document.querySelector('.company').setAttribute('checked','');
				//document.querySelector('.get-role').setAttribute('data-ng-model','donor');
				$scope.credentials.roles = 'donor';
			} else if (m === 'company'){
				document.querySelector('.company').setAttribute('checked','checked');
				document.querySelector('.donor').setAttribute('checked','');
				// console.log($scope.credentials);
				 $scope.credentials.roles = 'company';
				// console.log($scope.credentials);
				//document.query`
			}
			else{ console.log('how did you get here?'); }
		};
	}
]);
