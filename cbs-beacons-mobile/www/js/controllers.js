angular.module('starter')

.controller('AppCtrl', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  //$scope.username = AuthService.username();

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
})

.controller('LoginCtrl', function($scope, $state, $ionicPopup, AuthService) {
  $scope.user = {
    name:'',
    password:''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('main.dash', {}, {reload: true});
      //$scope.setCurrentUsername(data.username);
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

.controller('RegisterCtrl', function($scope, $state, $ionicPopup, AuthService){
  $scope.user = {
    name: '',
    firstName: '',
    lastName: '',
    email: '',
    password: ''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('outside.login');

      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: errMsg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };

})

.controller('BeaconCtrl',
  ['$scope', '$rootScope', '$ionicPlatform', '$cordovaBeacon',
   function($scope, $rootScope, $ionicPlatform, $cordovaBeacon) {

  var brIdentifier = 'estimote';
  var brUuid = 'B9407F30-F5F8-466E-AFF9-25556B57FE6D';
  var brMajor = null;
  var brMinor = null;
  var brNotifyEntryStateOnDisplay = true;
  $scope.cake = "Cakessss";
  //platForm(), version()
  var deviceInformation = ionic.Platform.platform();
  $scope.isAndroid      = deviceInformation;
  //ionic.Platform.exitApp();

  $ionicPlatform.ready(function () {
    $scope.didStartMonitoringForRegionLog = '';
    $scope.didDetermineStateForRegionLog = '';
    $scope.didRangeBeaconsInRegionLog = '';

    $scope.requestAlwaysAuthorization = function() {
      $cordovaBeacon.requestAlwaysAuthorization();
    };

    $scope.startMonitoringForRegion = function() {
      $cordovaBeacon.startMonitoringForRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };
    $scope.startRangingBeaconsInRegion = function() {
      $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };

    $scope.stopMonitoringForRegion = function() {
      $cordovaBeacon.stopMonitoringForRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };
    $scope.stopRangingBeaconsInRegion = function() {
      $cordovaBeacon.stopRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion(
        brIdentifier, brUuid, brMajor, brMinor, brNotifyEntryStateOnDisplay
      ));
    };

    $scope.clearLogs = function() {
      $scope.didStartMonitoringForRegionLog = '';
      $scope.didDetermineStateForRegionLog = '';
      $scope.didRangeBeaconsInRegionLog = '';
    };

    // ========== Events

    $rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function (event, pluginResult) {
      $scope.didStartMonitoringForRegionLog += '-----' + '\n';
      $scope.didStartMonitoringForRegionLog += JSON.stringify(pluginResult) + '\n';
    });

    $rootScope.$on("$cordovaBeacon:didDetermineStateForRegion", function (event, pluginResult) {
      $scope.didDetermineStateForRegionLog += '-----' + '\n';
      $scope.didDetermineStateForRegionLog += JSON.stringify(pluginResult) + '\n';
    });

    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $scope.didRangeBeaconsInRegionLog += '-----' + '\n';
      $scope.didRangeBeaconsInRegionLog += JSON.stringify(pluginResult) + '\n';
    });

    // =========/ Events

  });

}])

.controller('DashCtrl', function($scope, $state, $http, $ionicPopup, AuthService, API_ENDPOINT) {
  $scope.logout = function() {
    AuthService.logout();
    $state.go('outside.login');
  };

  $scope.performValidRequest = function() {
    $http.get(API_ENDPOINT.url + '/valid').then(
      function(result) {
        $scope.response = result.data.msg;
      });
  };

  $scope.performUnauthorizedRequest = function() {
    $http.get(API_ENDPOINT.url + '/notauthorized').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = result.data.err;
      });
  };

  $scope.performInvalidRequest = function() {
    $http.get(API_ENDPOINT.url + '/notauthenticated').then(
      function(result) {
        // No result here..
      }, function(err) {
        $scope.response = result.data.err;
      });
  };
});
