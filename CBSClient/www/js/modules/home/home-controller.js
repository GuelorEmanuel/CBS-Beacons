'use strict';

function HomeController($scope, $ionicModal, $timeout, $location,
                         $stateParams, $rootScope, $ionicPopup, $ionicPlatform,
                         $cordovaBeacon ) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});$ionicPlatform, $cordovaBeacon

  var brIdentifier = 'estimote';
  var brUuid = '6557b1a8-c7ef-0fdf-c5c2-90ec325161d2';
  var brMajor = null;
  var brMinor = null;
  var brNotifyEntryStateOnDisplay = true;
  $scope.beacons = {};

  //platForm(), version()
  var deviceInformation = ionic.Platform.isWebView();
  $scope.deviceInfo      = deviceInformation;
  console.log("Info: ", $scope.deviceInfo);
  //ionic.Platform.exitApp();

  $scope.formatDistance = function(meters) {

    if (!meters) { return 'Unknown'; }

    if (meters > 1) {
      return meters.toFixed(3) + ' m';
		}
		else {
      return (meters * 100).toFixed(3) + ' cm';
    }
	};

	$scope.formatProximity = function(proximity) {
    if (!proximity) { return 'Unknown'; }

    // Eliminate bad values (just in case).
		proximity = Math.max(0, proximity);
		proximity = Math.min(3, proximity);

		// Return name for proximity.
		return $scope.proximityNames[proximity];
	};


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

    $scope.requestAlwaysAuthorization();
    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $scope.didRangeBeaconsInRegionLog += '-----' + '\n';
      $scope.didRangeBeaconsInRegionLog += JSON.stringify(pluginResult) + '\n';

        var uniqueBeaconKey;

        for (var i = 0; i < pluginResult.beacons.length; i++) {
          uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":"+ pluginResult.beacons[i].minor;

          $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
          //$scope.beacons[uniqueBeaconKey].proximity = $scope.formatProximity($scope.beacons[uniqueBeaconKey].proximity);
        }
        $scope.$apply();
    });
    $scope.startRangingBeaconsInRegion();
    /*$cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote","B9407F30-F5F8-466E-AFF9-25556B57FE6D", null, null,true ));*/

    // =========/ Events

  });

}

module.exports = ['$scope', '$ionicModal', '$timeout','$location',
                  '$stateParams', '$rootScope', '$ionicPopup', '$ionicPlatform',
                  '$cordovaBeacon', HomeController];
