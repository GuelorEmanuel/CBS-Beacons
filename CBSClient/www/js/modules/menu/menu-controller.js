'use strict';

function MenuController($scope, $state, $ionicModal, $timeout, $location) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),

    /*$scope.bookAppt = function() {
        $state.go('outside.register');
    };

    $scope.manage = function() {
        $state.go('outside.manage');
    };

    $scope.donations = function() {
        $state.go('outside.donations');
    };

    $scope.nurse = function() {
        $state.go('outside.nurse');
    };*/
}
module.exports = ['$scope', '$state', '$ionicModal', '$timeout','$location', MenuController];
