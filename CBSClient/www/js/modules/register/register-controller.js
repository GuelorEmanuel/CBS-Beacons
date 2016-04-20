'use strict';

function RegisterController($scope, $state, $ionicPopup) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.user = {
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  $scope.submit = function(username) {
    console.log("usernme: ", username);
  };
  
}
module.exports = ['$scope', '$state', '$ionicPopup', RegisterController];
