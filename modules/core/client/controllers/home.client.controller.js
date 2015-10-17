'use strict';

angular.module('core').controller('HomeController', ['$scope','$rootScope','$http','$modal', 'Authentication','City','Itinerary',
  function ($scope,$rootScope, $http,$modal,Authentication,City,Itinerary) {
    // This provides Authentication context.
    $scope.authentication = Authentication;

      var modalScope = $rootScope.$new();
    //$scope.find = function () {
      //$scope.cities = City.query();
      console.log("in city");
      //console.log($scope.cities);
     $scope.recommend = function (parameter) {

                        if(parameter) {
                            if (parameter.length > 2) {
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
   $scope.range = function(count){

 return Array.apply(0, Array(+count));
}
      function days_between(date1, date2) {

          // The number of milliseconds in one day
          var ONE_DAY = 1000 * 60 * 60 * 24

          // Convert both dates to milliseconds
          var date1_ms = date1.getTime()
          var date2_ms = date2.getTime()

          // Calculate the difference in milliseconds
          var difference_ms = Math.abs(date1_ms - date2_ms)

          // Convert back to days and return
          return Math.round(difference_ms/ONE_DAY)

      }

      $scope.cityName='';
      $scope.checkIn='';
      $scope.checkOut='';
      $scope.save=false;
      $scope.numOfDays='';

      $scope.search= function(){
        console.log($scope.cityName);
        $scope.hotels=true;
        $scope.showSpinner=true;
        //console.log($scope.checkOut+ "----ffffffff----" + $scope.checkIn);
        $scope.numOfDays=days_between($scope.checkIn,$scope.checkOut);
          console.log("days between : "+ $scope.numOfDays);
        $http.get("http://developer.goibibo.com/api/voyager/get_hotels_by_cityid?app_id=d1a6be68&app_key=b6e71c60566aae6ce8d84edcc3b51bd7&city_id="+$scope.cityName.id).success(function(response){
            console.log(response.data);
            $scope.hotelsInfo= response.data;
            $scope.showSpinner=false;

        })
    };
        $scope.hotelData='';
      $scope.getHotelDetails=function(id,indx){
          $http.get("http://developer.goibibo.com/api/voyager/?app_id=d1a6be68&app_key=b6e71c60566aae6ce8d84edcc3b51bd7&method=hotels.get_hotels_data&id_list=%5B"+id+"%5D&id_type=_id").success(function(response){

              $scope.itineraries[indx].hotelInfo= response.data;
              $scope.hotelData=response.data[id].hotel_data_node;
              console.log($scope.hotelData);
              $scope.itineraries[indx].markers=[];
              $scope.indx=indx;
              $scope.itineraries[indx].attractions=$scope.hotelData.extra.attractions;
              $scope.itineraries[indx].desc= $scope.hotelData.desc.default;
              /*{ Distance: 6,
                      Description: "Hawa Mahal",
                      Unit: "kms"
              },*/
              $scope.itineraries[indx].mapcenter={title:$scope.hotelData.loc.full, content:$scope.hotelData.loc.location+","+$scope.hotelData.loc.city,lat:$scope.hotelData.loc.lat, lng:$scope.hotelData.loc.long};
              //$scope.itineraries[indx].markers.push({lat:$scope.hotelData.loc.lat, lng:$scope.hotelData.loc.long});
              for(var i=0;i<$scope.hotelData.loc.nhood.length;i++){
                  if($scope.hotelData.loc.nhood[i].t=="120"||$scope.hotelData.loc.nhood[i].t=="20"){
                      $scope.itineraries[indx].markers.push({title:$scope.hotelData.loc.nhood[i].n, content:"",lat:$scope.hotelData.loc.nhood[i].crd[0],lng:$scope.hotelData.loc.nhood[i].crd[1]});
                  }
              }
              console.log($scope.itineraries[indx].markers);
              $scope.showSpinner=false;
          });

      }
      $scope.infoWindow = {
          title: 'title',
          content: 'content'
      };
      $scope.showInfoWindow = function (event, p) {
          console.log(p);
          var infowindow = new google.maps.InfoWindow();
          var center = new google.maps.LatLng(p.lat, p.lng);

          infowindow.setContent(
              '<h4>' + p.title + '</h4>');

          infowindow.setPosition(center);
          infowindow.open($scope.objMapa);
      };
      $scope.$on('mapInitialized', function (event, map) {
          $scope.objMapa = map;
      });
      $scope.showMarker = function(event,id,i){
            console.log(i);
          $scope.marker =   $scope.itineraries[$scope.indx].markers[this.id];
          $scope.infoWindow = {
              title: $scope.marker.title,
              content: $scope.marker.content
          };
          $scope.$apply();
          //$scope.showInfoWindow(event, 'marker-info', this.getPosition());
      };
      $scope.exploreNearBy= function(){

      };
      $scope.saveIdea= function (hotel) {
          console.log(hotel);

          $http.post('createIdea', {
              data: hotel
          }).success(function (response) {
              console.log(response);
              $scope.saved=true;
          });

      }
      $scope.itinerary={};
      $scope.itinerary_data ={};


      // Create new Itinerary object
      $scope.showSuccess=false;

      $scope.addToItinerary=function(data,type){

          //$scope.modalInstance.dismiss('cancel');
         // console.log( $scope.itinerary_data);
          //console.log()
         if(data) {
             var d=$scope.itinerary.day.split("-");
             console.log(d);
             /*var itinerary_info= {
                 it_id:d[0],
                 title: $scope.itinerary.title,
                 type: 'hotel',
                 notes: $scope.itinerary.notes,
                 day: d[1],
                 day_number: d[0],
                 data: data,
                 created: {
                     at: new Date(),
                     by: $scope.authentication.user._id
                 }
             };*/
             var itinerary = new Itinerary({
                 title: $scope.itinerary.title,
                 type:'hotel',
                 notes: $scope.itinerary.notes,
                 day: d[1],
                 day_number:d[0],
                 data: data,
                 created: {
                     at: new Date(),
                     by: $scope.authentication.user._id
                 }

             });
             /*console.log(data.listOfDays);
             var itinerary = new Itinerary({
                 itinerary_arr:[],
                 days: data.listOfDays.length,
                 notes: $scope.itinerary.notes,
                                 //day_number:d[0],
                 title:$scope.itinerary.title,
                 created: {
                     at: new Date(),
                     by: $scope.authentication.user._id

                 }

             });
            // for (var i = 0; i < $scope.numOfDays; i++) {

                 itinerary.itinerary_arr.push(itinerary_info);
             //}
             for (var i = 1; i < data.listOfDays.length; i++) {

                 itinerary.itinerary_arr.push({day_number: i, day: data.listOfDays[i]});
             }*/

         }
        if(type){
            var d=$scope.itiner.day.split("-");
            console.log(d);
            var itinerary = new Itinerary({
                title: $scope.itiner.title,
                type:'user',
                notes: $scope.itiner.notes,
                day: d[1],
                day_number:d[0],
                place: $scope.itiner.place,
                created: {
                    at: new Date(),
                    by: $scope.authentication.user._id
                }

            });
        }
        else{
             console.log("inside else");

             var itinerary = new Itinerary({
                 title: $scope.itinerary.title,
                 type:'user',
                 notes: $scope.itinerary.notes,
                 day: $scope.itinerary.day,
                 place: $scope.itinerary.place,
                 created: {
                     at: new Date(),
                     by: $scope.authentication.user._id
                 }

             });
         }
          // Redirect after save
          itinerary.$save(function (response) {
              //$location.path('itinerary/' + response._id);
              $scope.showSuccess=true;
              console.log(response);
              $scope.findItineraries();
              // Clear form fields
              $scope.title = '';
              $scope.content = '';
          }, function (errorResponse) {
              $scope.showSuccess=false;
              $scope.showError=true;
              $scope.errorText = errorResponse.data.message;
          });
      };

      $scope.updateItinerary = function (i,indx) {



          var itinerary = $scope.iti;
          console.log(itinerary);
          $http.put('api/itinerary',{id: i._id,data:$scope.iti}).success(function(res){

              $scope.showSuccess =true;
          }).error(function(err){
              $scope.showError=true;
              $scope.error = errorResponse.data.message;
          });
      };
      $scope.cancel = function () {
          $scope.modalInstance.dismiss('cancel');

      };
      $scope.editItinerary=function(iti,flight){
            //$scope.itinerary=hotel;
          modalScope.iti=iti;
          console.log(iti);

          modalScope.modalInstance = $modal.open({
              controller: 'HomeController',
              templateUrl: '/modules/core/client/views/edit.itinerary.html',
              scope: modalScope,
              backdrop: 'static',
              keyboard: true,
              dialogFade: true,
              resolve: {
                  img: function () {
                      console.log('Inside Upload control resolve..');
                      return $scope.iti;
                  }
              }
          });
          modalScope.modalInstance.opened.then(function () {

          });

          modalScope.modalInstance.result.then(function (response) {


          });
      }
      $scope.addToList=function(id,iti,indx){
          //$scope.itinerary=hotel;
          modalScope.iti=iti;
          console.log(indx);

          modalScope.modalInstance = $modal.open({
              controller: 'HomeController',
              templateUrl: '/modules/core/client/views/edit.itinerary2.html',
              scope: modalScope,
              backdrop: 'static',
              keyboard: true,
              dialogFade: true,
              resolve: {
                  img: function () {
                      console.log('Inside Upload control resolve..');
                      return $scope.iti;
                  }
              }
          });
          modalScope.modalInstance.opened.then(function () {

          });

          modalScope.modalInstance.result.then(function (response) {


          });
      }


      $scope.openAttraction = function (hotel,attraction) {

              console.log(hotel);
              console.log(attraction);
              var itiner = {
                  place:hotel.data.city,
                  title:"Visit to" +attraction.Description,
                  listOfDays:hotel.data.listOfDays

              };

            console.log(itiner);
          modalScope.itiner=itiner;


          modalScope.modalInstance = $modal.open({
              controller: 'HomeController',
              templateUrl: '/modules/core/client/views/create.attraction.html',
              scope: modalScope,
              backdrop: 'static',
              keyboard: true,
              dialogFade: true,
              resolve: {
                  target: function () {
                      console.log('Inside Upload control resolve..');
                      console.log($scope.itiner);
                      return $scope.itiner;
                  }
              }
          });
          modalScope.modalInstance.opened.then(function () {

          });

          modalScope.modalInstance.result.then(function (response) {


          });
      };
      $scope.openItinerary = function (hotel,flight,attraction) {
          if(hotel && attraction){
                console.log(hotel);
              console.log(attraction);
              var data = hotel.data;
              $scope.itinerary_data = {


              };

          }
          if(hotel &&!attraction) {
              var data = hotel.hotel_data_node;
              console.log($scope.numOfDays);

              $scope.itinerary_data = {
                  name: data.name,
                  id: data._id,
                  rating: data.rating,
                  img: data.img_selected.thumb.l,
                  city: data.loc.city,
                  country_code: data.loc.cnt_code,
                  country: data.loc.country,
                  lat: data.loc.lat,
                  location: data.loc.location,
                  long: data.loc.lon,
                  state: data.loc.state,
                  days: $scope.numOfDays,
                  listOfDays: getDates($scope.checkIn, $scope.checkOut)

              };
          }
          if(flight){
              var data = flight;
              console.log(data);

              $scope.itinerary_data = {
               ArrivalTime: "2015-10-18T07:00:00.000+05:30",
               AvailabilityDisplayType: "Fare Shop/Optimal Shop",
               CabinClass: "Economy",
               DepartureTime: "2015-10-18T05:00:00.000+05:30",
               Group: "0",
               aircraftType: "320",
               airline: "Air India",
               arrdate: "2015-10-18t0700",
               arrtime: "07:00",
               bookingclass: "T",
               carrierid: "AI",
               carriers: "ALL",
               datafrom: "travelport",
               datasource: "",
               depdate: "2015-10-18t0500",
               deptime: "05:00",
               destination: "PNQ",
               duration: "2h 0m",
               farebasis: "TIPFS",
               flightcode: "851",
                  flightno: "851",
                  ibibopartner: "travelport",
                  internationalsearch: "true",
                  operatingcarrier: "AI",
                  origin: "DEL",
                  platingcarrier: "AI",
                  provider: "1G",
                  rating: 300,
                  refundable: "true",
                  row_type: "onwardflights",
                  seatingclass: "E",
                  seatsavailable: "9",
                  splitduration: "2h 0m",
                  status: "",
                  stops: "0",
                  tickettype: "e"


              };
          }
          modalScope.data=$scope.itinerary_data;

          modalScope.modalInstance = $modal.open({
              controller: 'HomeController',
              templateUrl: '/modules/core/client/views/create.itinerary.html',
              scope: modalScope,
              backdrop: 'static',
              keyboard: true,
              dialogFade: true,
              resolve: {
                  target: function () {
                      console.log('Inside Upload control resolve..');
                      return $scope.itinerary;
                  }
              }
          });
          modalScope.modalInstance.opened.then(function () {

          });

          modalScope.modalInstance.result.then(function (response) {


          });
      };

     /*Check if hotel data exists in users itinerary*/
      $scope.checkIfDataExists=function(id){
          console.log(id);
          $http.post('api/itinerary_check',{id:id,user:$scope.authentication.user._id}).success(function(res){
             //console.log(res);
              if(res.exists==true){
                  console.log("In true");

                  $scope.showAdded=true;
              }
              else{
                 $scope.showAdded=false;

              }
          });


          // Find existing Itinerary
         /* $scope.findOne = function () {
              $scope.itinerary = Itinerary.get({
                  itineraryId: $stateParams.itineraryId
              });
          };*/
         // if() exists  then  addtoItninerary green  true else openitinerary
      }
      $scope.findItineraries = function () {
          $scope.itineraries = Itinerary.query({itineraryId:$scope.authentication.user._id});
          console.log($scope.itineraries);
      };

      $scope.sendMail = function() {
            // Simple POST request example (passing data) :
          console.log($scope.authentication.user);

             /* var link = "mailto:"+ email
                  + "?subject=New%20email " + escape(subject)
                  + "&body=" + escape(body);*/
         var l="mailto:?subject=Itinerary%20for%20My%20Trip&body=building%20an%20awesome%20itinerary%20for%20my%20trip%20using%20Travel%20With%20Me%20App%20and%20I%20thought%20you%27d%20like%20to%20see%20it.%20Here%20a%20link:%20http://localhost:3000/itinerary/"+$scope.authentication.user._id;
          window.location.href = l;

          $http.post('/mail', {name:$scope.authentication.user.email ,receiver:"ntekriwal@gmail.com", msg: "Itinerary for My Trip : I'm building an awesome itinerary for my trip using Travefy and I thought you'd like to see it. " +
          "Here's a link: http://localhost:3000/itinerary/"+$scope.authentication.user._id}).
              success(function(data, status, headers, config) {
                  // this callback will be called asynchronously
                  console.log(data);
                  // when the response is available
              }).
              error(function(data, status, headers, config) {
                  // called asynchronously if an error occurs
                  // or server returns response with an error status.
              });
      }
      $scope.today = function() {
          $scope.dt = new Date();
      };


      $scope.today();

      $scope.clear = function () {
          $scope.dt = null;
      };

      // Disable weekend selection
      $scope.disabled = function(date, mode) {
          return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      };

      $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date();
      };
      $scope.toggleMin();
      $scope.maxDate = new Date(2020, 5, 22);

      $scope.open = function($event) {
          $scope.status.opened = true;
      };
      $scope.open2 = function($event) {
          $scope.status2.opened = true;
      };

      $scope.setDate = function(year, month, day) {
          $scope.dt = new Date(year, month, day);
      };

      $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
      };

      $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
      $scope.format = $scope.formats[0];

      $scope.status = {
          opened: false
      };
      $scope.status2 = {
          opened: false
      };

      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      var afterTomorrow = new Date();
      afterTomorrow.setDate(tomorrow.getDate() + 2);
      $scope.events =
          [
              {
                  date: tomorrow,
                  status: 'full'
              },
              {
                  date: afterTomorrow,
                  status: 'partially'
              }
          ];

      $scope.getDayClass = function(date, mode) {
          if (mode === 'day') {
              var dayToCheck = new Date(date).setHours(0,0,0,0);

              for (var i=0;i<$scope.events.length;i++){
                  var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

                  if (dayToCheck === currentDay) {
                      return $scope.events[i].status;
                  }
              }
          }

          return '';
      };

      $scope.getNumber = function(num) {
          return new Array(num);
      }
      Date.prototype.addDays = function(days) {
          var dat = new Date(this.valueOf())
          dat.setDate(dat.getDate() + days);
          return dat;
      }

      function getDates(startDate, stopDate) {
          var dateArray = new Array();
          var currentDate =startDate;
          console.log(currentDate);
          while (currentDate <= stopDate) {
              dateArray.push( new Date (currentDate));
              currentDate = currentDate.addDays(1);
          }
          console.log(dateArray);
          return dateArray;
      }


 //FLIGHTSSSSSSSSSSSSSSSS



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
      $scope.fbShare=function( title, descr, image, winWidth, winHeight) {
          var url='http://localhost:3000/'+$scope.authentication.user._id + "Find my Itinerary here and Travel With Me";
          var winTop = (screen.height / 2) - (winHeight / 2);
          var winLeft = (screen.width / 2) - (winWidth / 2);
          window.location.href='http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight;
      }
      $scope.centerAt='';
      $scope.googleMapsUrl="http://maps.google.com/maps/api/js?v=3.20";

      /*var mapOptions = {
          zoom: 4,
          center: new google.maps.LatLng(40.0000, -98.0000),
          mapTypeId: google.maps.MapTypeId.TERRAIN
      }*/
     /* $scope.$on('mapInitialized', function() {
         // $http.get('some/url').then(function(data) {
              $scope.centerAt = $scope.hotelData.loc.lat +" , "+$scope.hotelData.loc.long;
              //$scope.map.setCenter(center);
          console.log($scope.centerAt);
         // });
      });*/

     /* $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);

      $scope.markers = [];

      var infoWindow = new google.maps.InfoWindow();

      var createMarker = function (info){

          var marker = new google.maps.Marker({
              map: $scope.map,
              position: new google.maps.LatLng(info.lat, info.long),
              title: info.city
          });
          marker.content = '<div class="infoWindowContent">' + info.desc + '</div>';

          google.maps.event.addListener(marker, 'click', function(){
              infoWindow.setContent('<h2>' + marker.title + '</h2>' + marker.content);
              infoWindow.open($scope.map, marker);
          });

          $scope.markers.push(marker);

      }

      for (i = 0; i < cities.length; i++){
          createMarker(cities[i]);
      }

      $scope.openInfoWindow = function(e, selectedMarker){
          e.preventDefault();
          google.maps.event.trigger(selectedMarker, 'click');
      }*/

  }]);
