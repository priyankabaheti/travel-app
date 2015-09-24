'use strict';

// Articles controller
angular.module('articles').controller('ArticlesController', ['$scope','$http', '$stateParams', '$location', 'Authentication', 'Articles',
  function ($scope, $http,$stateParams, $location, Authentication,Articles) {
    $scope.authentication = Authentication;

    // Create new Article
    $scope.create = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      // Create new Article object
      var article = new Articles({
        title: this.title,
        content: this.content
      });

      // Redirect after save
      article.$save(function (response) {
        $location.path('articles/' + response._id);

        // Clear form fields
        $scope.title = '';
        $scope.content = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
 $scope.recommendFlight = function (parameter) {

                        if(parameter) {
                            if (parameter.length > 2) {
                                $scope.showSpinner=true;
                                return $http.get('api/airport?search=' + parameter,  { cache: true}).then(function (cities) {

                                    if (cities.data.TotalCities == 0) {
                                        cities.data.AirportData.push({'title': "No Result found",'id':0,'img':false});
                                        return cities.data.AirportData.map(function (item) {
                                            return ({title:item.title ,'img':false});
                                        });
                                    }
                                    else {
                                        return cities.data.AirportData.map(function (item) {
                                            
                                            return({'id': item.code, 'title': item.city});

                                        });
                                    }
                                    $scope.showSpinner =false;
                                });
                            }
                        }


                    };


  $scope.source=''; 
  $scope.destination='';
  $scope.startDate=''; 
  $scope.endDate='';
  $scope.searchFlights= function(){
    console.log($scope.source);
    var sourceCode= $scope.source.id;
    var destinationCode=$scope.destination.id;
    $scope.flights=true;
    var seatingClass= this.seatingclass;
    if(seatingClass==undefined){
      seatingClass='E';
    }
    $scope.showSpinner=true;
    console.log($scope.startDate+ "----ffffffff----" + $scope.endDate);
      var formattedDate = moment($scope.startDate).format('YYYYMMDD');
      console.log(formattedDate);

    if(!$scope.endDate){
      $http.get("http://developer.goibibo.com/api/search/?app_id=d1a6be68&app_key=b6e71c60566aae6ce8d84edcc3b51bd7&format=json&source="
      +sourceCode+"&destination="+destinationCode+"+&dateofdeparture="+formattedDate+"&seatingclass="+seatingClass+"&adults=1&children=0&infants=0")
    .success(function(response){
      console.log(response.data);
      $scope.onwardFlights= response.data.onwardflights;

      $scope.showSpinner=false;

    });
  }
  if($scope.endDate){
     var endDate = moment($scope.endDate).format('YYYYMMDD');
      console.log(endDate);
      $http.get("http://developer.goibibo.com/api/search/?app_id=d1a6be68&app_key=b6e71c60566aae6ce8d84edcc3b51bd7&format=json&source="
      +sourceCode+"&destination="+destinationCode+"+&dateofdeparture="+formattedDate+"&dateofarrival="+endDate+"&seatingclass="+seatingClass+"&adults=1&children=0&infants=0")
    .success(function(response){
      console.log(response.data);
      $scope.flightsInfo= response.data;
      $scope.showSpinner=false;

    });
  }
  };
    // Remove existing Article
    $scope.remove = function (article) {
      if (article) {
        article.$remove();

        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };

    // Update existing Article
    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'articleForm');

        return false;
      }

      var article = $scope.article;

      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };

    // Find a list of Articles
    $scope.find = function () {
      $scope.articles = Articles.query();
    };

    // Find existing Article
    $scope.findOne = function () {
      $scope.article = Articles.get({
        articleId: $stateParams.articleId
      });
    };
  }
]);
