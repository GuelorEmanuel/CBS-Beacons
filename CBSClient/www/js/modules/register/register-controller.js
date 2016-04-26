'use strict';

function RegisterController($scope, $state, $ionicPopup, LoginService) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.registerData = {};

  $scope.signup = function() {
    LoginService.register($scope.registerData).then(function(msg) {

      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
      $state.go('outside.login');
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };

}
module.exports = ['$scope', '$state', '$ionicPopup', 'LoginService', RegisterController];
