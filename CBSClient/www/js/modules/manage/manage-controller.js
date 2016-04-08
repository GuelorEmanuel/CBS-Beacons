'use strict';

function ManageController($scope, $ionicModal, $timeout, $location, $ionicPopup, $state) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),

    // Perform the login action when the user submits the login form
    // $scope.doLogin = function() {
    //     console.log('Doing login', $scope.loginData);
    //     $location.path('/outside/help');
    //     console.log("console");
    //     // Simulate a login delay. Remove this and replace with your login
    //     // code if using a login system
    //     $timeout(function() {
    //         $scope.closeLogin();
    //     }, 1000);
    // };

    // Perform the login action when the user submits the medical information
    $scope.submit = function() {
        var alertPopup = $ionicPopup.show({
            title: 'Thanks!',
            template: 'Your medical information has been processed. Thank you for taking the time to complete this form.',
            buttons: [
                { text: "Ok" }
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
    };
}
module.exports = ['$scope', '$ionicModal', '$timeout','$location', '$ionicPopup', '$state', ManageController];

