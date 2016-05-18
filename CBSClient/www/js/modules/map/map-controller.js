/*
 * Login Map Controller: contains method for map page
 * by: Guelor Emanuel
 */

'use strict';

function MapController($scope, $state, $cordovaGeolocation, $ionicPopup,
                       localStorageService, SocketService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var options = {timeout: 10000, enableHighAccuracy: false}; // may cause error if true


  $cordovaGeolocation.getCurrentPosition(options).then(function(position){

    /* jshint ignore:start */
    var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    var mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);

    google.maps.event.addListenerOnce($scope.map, 'idle', function(){

      var marker = new google.maps.Marker({
        map: $scope.map,
        animation: google.maps.Animation.DROP,
        position: latLng
      });

      var infoWindow = new google.maps.InfoWindow({
        content: "You are here!"
      });

      google.maps.event.addListener(marker, 'click', function () {
        infoWindow.open($scope.map, marker);
      });
    });

    /* jshint ignore:end */
  }, function(error){
    console.log("Could not get location");
    var alertPopup = $ionicPopup.alert({
      title: 'Could not get location!',
      template: 'Could not get the current position. Either GPS signals are weak or GPS has been switched off'
    });
  });


}
module.exports = ['$scope', '$state', '$cordovaGeolocation','$ionicPopup',
                  'localStorageService', 'SocketService', MapController];
