'use strict';

function LoginController($scope, $ionicModal, $timeout, $location,
                         $ionicLoading, $ionicPopup, $state, LoginService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('js/modules/login/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
    $state.go('outside.index', {"test": 123}, {reload: true });
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  $scope.show = function() {
    $ionicLoading.show({
      template:'<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
 $scope.hide = function(){
   $ionicLoading.hide();
 };

  //Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    //Start showing the progress
    $scope.show($ionicLoading);

    //Do the call to a service using $http or directly do the call here
    LoginService.login($scope.loginData).then(function(data) {

      $state.go('cbs.home', {}, {reload: true});
    }).catch(function(data) {

      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Wrong username or password'
      });



    }).finally(function($ionicLoading) {
      //On both cases hide the loading
      $scope.hide($ionicLoading);
    });
  };

  //@TODO Perform the facebook login action
  $scope.doFbLogin = function() {

  };

  




}

module.exports = ['$scope', '$ionicModal', '$timeout','$location',
                  '$ionicLoading','$ionicPopup', '$state', 'LoginService',
                   LoginController];
