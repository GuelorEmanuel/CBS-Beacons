'use strict';

function MenuController($scope, $state, $ionicModal, $timeout, $location,
                        LoginService) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    $scope.logout = function() {
      LoginService.logout();
      $state.go('outside.login');
    };
}
module.exports = ['$scope', '$state', '$ionicModal', '$timeout',
                  '$location','LoginService', MenuController];
