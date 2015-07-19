'use strict';

// Companies controller
angular.module('companies').controller('CompaniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companies', '$http',
	function($scope, $stateParams, $location, Authentication, Companies, $http) {
		$scope.authentication = Authentication;

		$scope.logThis = function(m){
			console.log(m);
		};
		// Create new Company
		$scope.create = function() {
			// Create new Company object
			var company = new Companies ({
				name: this.name
			});

			// Redirect after save
			company.$save(function(response) {
				$location.path('companies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
			$scope.credentials.roles = [];
		};

		// Remove existing Company
		$scope.remove = function(company) {
			if ( company ) {
				company.$remove();

				for (var i in $scope.companies) {
					if ($scope.companies [i] === company) {
						$scope.companies.splice(i, 1);
					}
				}
			} else {
				$scope.company.$remove(function() {
					$location.path('companies');
				});
			}
		};

		// Update existing Company
		$scope.update = function() {
			var company = $scope.company;

			company.$update(function() {
				$location.path('companies/' + company._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Companies
		$scope.find = function() {
			$scope.companies = Companies.query();
		};

		// Find a list of Companies by User
		$scope.findCompaniesByUser = function() {
			$http.get('/companiesByUser').success(function(data, status, headers, config){
				$scope.companies = data;
			}).error(function(data, status, headers, config){
				console.log('error');
			});
		};

		// Find existing Company
		$scope.findOne = function() {
			$scope.company = Companies.get({
				companyId: $stateParams.companyId
			});
		};
	}
]);
