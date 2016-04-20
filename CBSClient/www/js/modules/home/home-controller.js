'use strict';

function LoginController($scope, $ionicModal, $timeout, $location,
                         $stateParams, $ionicPopup ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  console.log($stateParams);
  var alertPopup = $ionicPopup.alert({
    title: 'Login failed!',
    template: 'Wrong username or password'
  });


}

module.exports = ['$scope', '$ionicModal', '$timeout','$location',
                   '$stateParams', '$ionicPopup', LoginController];
