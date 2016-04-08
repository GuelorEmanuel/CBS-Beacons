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

  console.log("in the controller");
  $scope.signup = function() {

    var alertPopup = $ionicPopup.show({
      title: 'Confirmation!',
      template: 'Are you sure you want to book this appointment?',
      buttons: [
        { text: "Yes" },
        { text: "No" }
      ]
    })
    .then(function(res) {
      if (res) {

      }
      else {
        $ionicPopup.show({
          title: 'Success!',
          template: 'Success! You have booked your appointment. You can complete the medical forms now or access them later through the Manage Appointment screen in the main menu.',
          buttons: [
            { text: "Complete forms" },
            { text: 'Finish later' }
          ]
        }).then(function(res) {
          if(res) {

          }
          else {
            /*
            CHANGE THE PLACE HERE TO GO TO MANAGE APPOINTMENT
             */
            $state.go('outside.donations');
          }
        });
      }
    });
  };



}
module.exports = ['$scope', '$state', '$ionicPopup', RegisterController];
