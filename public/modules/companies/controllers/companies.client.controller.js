'use strict';

// Companies controller
angular.module('companies').controller('CompaniesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Companies', '$http', '$modal',
	function($scope, $stateParams, $location, Authentication, Companies, $http, $modal) {
		$scope.authentication = Authentication;
		// $http.defaults.headers.post['Content-Type'] = 'application/json';

		$scope.init = function(){
			$http.get('/client_token').success(function(data, status, headers, config){
				$scope.clientToken = data;
			}).error(function(data, status, headers, config){
				console.log('error');
			});
		};
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

		$scope.creditCard={amount: 0, creditCard: {number: '', expirationDate: ''}};
		// $scope.creditCard.amount = '5.00';
		// $scope.creditCard.creditCard = {
		// 	number: '4111111111111111',
		// 	expirationDate: '05/12'};

		$scope.postForm = function(){
			console.log($scope.creditCard);
			$http.post('/checkout', {'creditCard': $scope.creditCard})
		  .success(function(data, status, headers, config) {
		    // this callback will be called asynchronously
		    // when the response is available
				console.log('success');
				console.log(data);
				var company = $scope.company;

				company.money_usable +=  Number(data);
				console.log(company.money_usable);
				//console.log(company);

				company.$update(function() {
					// $location.path('/companies/' + company._id);
					$scope.openA();

					//window.location.reload();
				}, function(errorResponse) {
					$scope.error = errorResponse.data.message;
				});
		  }).
		  error(function(data, status, headers, config) {
				$scope.error = data;
		    // called asynchronously if an error occurs
		    // or server returns response with an error status.
		  });
		};

		// Find existing Company
		$scope.findOne = function() {
			$scope.company = Companies.get({
				companyId: $stateParams.companyId
			});
		};

		$scope.showForm = function() {
			document.querySelector('.changeForm').setAttribute('class','hidden');
			document.querySelector('form').setAttribute('class','');
		};
		$scope.items = ['item1', 'item2', 'item3'];

		$scope.open = function (size) {

			var modalInstance = $modal.open({
				animation: $scope.animationsEnabled,
				templateUrl: 'myModalContent.html',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {
					items: function () {
				    	return $scope.items;
					}
				}
			});


			$scope.toggleAnimation = function () {
			    $scope.animationsEnabled = !$scope.animationsEnabled;
			};
			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
			$scope.animationsEnabled = true;
		};

		$scope.openA = function (size) {

			var newModalInstance = $modal.open({
				animation: $scope.animationsEnabled,
				template: '<div class=modal-head><h3 class="modal-title">Thank You for Donating!</h3></div><div class=modal-footer><button class="btn btn-primary" ng-click=continue()>OK</button></div>',
				controller: 'ModalInstanceCtrl',
				size: size,
				resolve: {
					items: function () {
						return $scope.items;
					}
				}
			});


			$scope.toggleAnimation = function () {
				$scope.animationsEnabled = !$scope.animationsEnabled;
			};
			newModalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
			$scope.animationsEnabled = true;
		};

	}
]).controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.ok = function () {
    $modalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  $scope.continue = function () {
	  window.location.reload();
  }
});
