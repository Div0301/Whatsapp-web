var app=angular.module('Home-page',["ngRoute","zingchart-angularjs"]);
app.config(function($routeProvider,$locationProvider)
{

	$routeProvider
		.when("/",{
			templateUrl:"how-it-works.html",
			//$scope.csrfToken=csrfToken
			})
		.when("/expense",{
			templateUrl:"expense.html",
			})
		.when("/income",{
			templateUrl:"income.html",
			})

		.when("/profile",{
			templateUrl:"profile.html"
		})

		$locationProvider.html5Mode(true);
});

app.controller('myCtrl', function ($scope, $http , $location){
console.log('here');

$scope.login=function(){
	console.log('herell');
	console.log($scope.log);
	   $http.post('/log',$scope.log).then(function(response){
   		if(response.data=='no')
   		{
   			login();
   		}
   		else

   		{
   			//console.log(response.data);
			var expmail=response.data;
			console.log(expmail);
   			$location.path('/profile');

   		}
//$scope.message=response.data;

   },
   function (error){
   	console.log("no the data requested");
   });
}

$scope.signup=function()
{
	console.log($scope.sig);
	$http.post('/user_signup',$scope.sig).then(function(response)
	{
		//$scope.message=response.data;
		if(response.data=='yes')
			console.log('wiji');
		
	},
	function(error)
	{
		$scope.message='invalid';
		console.log("no the data inserted");
	})
}


$scope.expense=function()
{
	console.log($scope.exp);
	$http.post('/user_expense',$scope.exp).then(function(response)
	{
		//$scope.message=response.data;
		if(response.data=='yes')
			console.log('wiji');
		
	},
	function(error)
	{
		$scope.message='invalid';
		console.log("no the data inserted");
	})
}


$scope.eview=function()
{
	
	$http.get('/view_expense',$scope.exp).then(function(response)
	{
		//$scope.message=response.data;
		//if(response.data=='yes')
		 //console.log(response);
		$scope.status=response.data;
		console.log(status);
			
      

		
	},
	function(error)
	{
		$scope.message='invalid';
		console.log("no the data inserted");
	})
}


});