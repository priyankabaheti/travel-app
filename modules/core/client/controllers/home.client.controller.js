'use strict';

angular.module('core').controller('HomeController', ['$scope','$http', 'Authentication','City',
  function ($scope, $http,Authentication,City) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    //$scope.find = function () {
      //$scope.cities = City.query();
      console.log("in city");
      //console.log($scope.cities);
     $scope.recommend = function (parameter) {

                        if(parameter) {
                            if (parameter.length > 2) {
                                $scope.showSpinner=true;
                                return $http.get('api/cities?search=' + parameter,  { cache: true}).then(function (cities) {

                                    if (cities.data.TotalCities == 0) {
                                        cities.data.CityData.push({'title': "No Result found",'id':0,'img':false});
                                        return cities.data.TargetData.map(function (item) {
                                            return ({title:item.title ,'img':false});
                                        });
                                    }
                                    else {
                                        return cities.data.CityData.map(function (item) {
                                            
                                            return({'id': item.cityID, 'title': item.city_name});

                                        });
                                    }
                                    $scope.showSpinner =false;
                                });
                            }
                        }


                    };
   
  
  $scope.cityName='';
  $scope.search= function(){
  	console.log($scope.cityName);
  	$http.get("http://developer.goibibo.com/api/voyager/get_hotels_by_cityid?app_id=d1a6be68&app_key=b6e71c60566aae6ce8d84edcc3b51bd7&city_id="+$scope.cityName.id).success(function(response){
  		console.log(data);

  	})
  };
}
]);
