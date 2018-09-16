// Module
var app = angular.module('app-webapi', []);

// -----------------------------------------  Service section
app.service('serviceApi', ['$http', function ($http) {

	// I used local server: using json-server npm to create an easy API + DB.
	// You can read all about it here: https://github.com/typicode/json-server.

	// Data Members
	this.tokenUrl = "http://localhost:3000/";
	this.baseUrl = "http://localhost:3001/";

	// Get the token
	this.getToken = function () {
		return $http.get(this.tokenUrl + "users");
	}

	// Get cities list
	this.getCities = function (token) {

		// Return city names
		return $http(
			{
				method: 'GET',
				url: this.baseUrl + "cities",
				headers: {
					'Authorization': token
				}
			}
		);
	}

	// Get streets names by a city code
	this.getStreets = function (token, cityCode) {

		// Return streets names
		return $http(
			{
				method: 'GET',
				url: this.baseUrl + "streets?city_code=" + cityCode,
				headers: {
					'Authorization': token
				}
			}
		);
	}
}]);

// ----------------------------------------- Controller section
app.controller('ctrlApi', ['$scope', 'serviceApi', function ($scope, serviceApi) {


	// First get the token 
	serviceApi.getToken().success(function (users) {
		$scope.token = users[0].token;

		// Second get the list of city names.
		serviceApi.getCities($scope.token).then(function (response) {
			$scope.cities = response.data;
		}).catch(function (e) {
			console.log(e);
		});

	}).error(function (e) {
		console.log(e);
	});

	$scope.cityStreets = null;
	$scope.selected = "";

	// When user chooses city:
	$scope.onSelect = function () {

		// Show the list of city streets 
		var city = JSON.parse(this.selected);

		// Get the street-list by using city-code
		serviceApi.getStreets($scope.token, city.city_code).then(function (response) {
			$scope.cityStreets = response.data[0].streets_names;
		}).catch(function (e) {
			console.log(e);
		});
	}
}]);

