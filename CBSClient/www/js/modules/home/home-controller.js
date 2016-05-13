'use strict';

function HomeController($scope, $ionicModal, $timeout, $location,
                         $stateParams, $rootScope, $ionicPopup, $ionicPlatform,
                         $cordovaBeacon, LoginService, $state,
                         localStorageService, SocketService, $cordovaGeolocation,
                         AUTH_EVENTS) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});$ionicPlatform, $cordovaBeacon $state, localStorageService, SocketService

  var brIdentifier = 'estimote';
  var brUuid = '6557b1a8-c7ef-0fdf-c5c2-90ec325161d2';
  var brMajor = null;
  var brMinor = null;
  var brNotifyEntryStateOnDisplay = true;
  $scope.beacons = {};
  $scope.testUpdateRoom = 0;
  $scope.testLocations = 0;
  //platForm(), version()
  var deviceInformation = ionic.Platform.isWebView();
  $scope.userInfo           = localStorageService.get(LoginService.getKey());
  $scope.deviceInfo      = deviceInformation;
  console.log("Info: ", $scope.deviceInfo);
  //ionic.Platform.exitApp();


	// Nearest ranged beacon.
	$scope.mNearestBeacon = null;
  $scope.mNearestRoom = null;
  $scope.mNearestUsers = null;
  $scope.mCurrentUserStamp = null;

  // Here monitored regions are defined.
	// You can add as many beacons as you want to use.
	var mRegions =
	[
		{
			id: 'RegistrationRoom',
			uuid: "6557b1a8-c7ef-0fdf-c5c2-90ec325161d2",
			major: "53270",
			minor: "32099",
      pic: "registration.png",
      info: "Please make yourself comfortable, we will notify you when when it's your turn.",
      timeStamp: ""

		},
		{
			id: 'ScreeningRoom',
			uuid: "6557b1a8-c7ef-0fdf-c5c2-90ec325161d2",
			major: "63719",
			minor: "59871",
      pic: "ScreeningRoom.png",
      info: "Please stay seated, a nurse will be right with you very soon!",
      timeStamp: ""
		},
		{
			id: 'RecoveryRoom',
			uuid: "6557b1a8-c7ef-0fdf-c5c2-90ec325161d2",
			major: "15357",
			minor: "18805",
      pic: "RecoveryRoom.jpg",
      info: "Please take the time to rest, if you need further assistant you can contact the nurse on the message board",
      timeStamp: ""
		}
	];

  var noRoomFound = {
                     id: 'noRoomFound',
                     uuid: "0",
                     major: "0",
                     minor: "0",
                     pic: "registration.png",
                     info: "Opps, there is no beacons in your region",
                     timeStamp: "0:00"
                    };

  var me = this;
  me.current_room = localStorageService.get('room');


  me.rooms = noRoomFound;
  $scope.mNearestRoom = noRoomFound;
  $scope.mCurrentUserStamp = noRoomFound;

  localStorageService.set('username', $scope.userInfo.firstname);
  console.log("name "+ $scope.userInfo.firstname);

  $scope.enterRoom = function(room_name){
    me.current_room = room_name;
    localStorageService.set('room', room_name);
    var room = {
      'room_name': room_name
    };

    SocketService.emit('join:room', room);
    $state.go('cbs.room');
  };

  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    LoginService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  function getBeaconId(beacon) {
		return beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
	}

  function isSameBeacon(beacon1, beacon2) {
		return getBeaconId(beacon1) == getBeaconId(beacon2);
	}


  function isNearerThan(beacon1, beacon2) {
		return beacon1.accuracy > 0 &&
           beacon2.accuracy > 0 &&
           beacon1.accuracy < beacon2.accuracy;
	}

  function updateNearestBeacon(beacons) {
		for (var i = 0; i < beacons.length; ++i) {
			var beacon = beacons[i];

      if (!$scope.mNearestBeacon) {
				$scope.mNearestBeacon = beacon;
			}
			else {
				if (isSameBeacon(beacon, $scope.mNearestBeacon)){
          $scope.mNearestBeacon = beacon;
        }
				else if (isNearerThan(beacon, $scope.mNearestBeacon)) {
					$scope.mNearestBeacon = beacon;
				}
			}
		}
	}


  $scope.formatDistance = function(meters) {

    if (!meters) { return 'Unknown'; }

    if (meters > 1) {
      return meters.toFixed(3) + ' m';
		}
		else {
      return (meters * 100).toFixed(3) + ' cm';
    }
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
    $scope.requestAlwaysAuthorization();

    $rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function (event, pluginResult) {
      $scope.didStartMonitoringForRegionLog += '-----' + '\n';
      $scope.didStartMonitoringForRegionLog += JSON.stringify(pluginResult) + '\n';

      var uniqueBeaconKey;

      for (var i = 0; i < pluginResult.beacons.length; i++) {
        uniqueBeaconKey = getBeaconId(pluginResult.beacons[i]);

        $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
        //$scope.beacons[uniqueBeaconKey].proximity = $scope.formatProximity($scope.beacons[uniqueBeaconKey].proximity);
      }
      $scope.$apply();

    });

    $rootScope.$on("$cordovaBeacon:didDetermineStateForRegion", function (event, pluginResult) {
      $scope.didDetermineStateForRegionLog += '-----' + '\n';
      $scope.didDetermineStateForRegionLog += JSON.stringify(pluginResult) + '\n';
    });


    $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function (event, pluginResult) {
      $scope.didRangeBeaconsInRegionLog += '-----' + '\n';
      $scope.didRangeBeaconsInRegionLog += JSON.stringify(pluginResult) + '\n';


        var uniqueBeaconKey;

        for (var i = 0; i < pluginResult.beacons.length; i++) {
          uniqueBeaconKey = pluginResult.beacons[i].uuid + ":" + pluginResult.beacons[i].major + ":"+ pluginResult.beacons[i].minor;

          $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
          updateNearestBeacon(pluginResult.beacons);
          //$scope.beacons[uniqueBeaconKey].proximity = $scope.formatProximity($scope.beacons[uniqueBeaconKey].proximity);
        }
        $scope.$apply();
    });

    $rootScope.$on('$cordovaBeacon:didEnterRegion', function(event, pluginResult) {

    });

    $rootScope.$on('$cordovaBeacon:didExitRegion', function(event, pluginResult) {

    });

    $scope.startRangingBeaconsInRegion();

    //$cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("estimote","B9407F30-F5F8-466E-AFF9-25556B57FE6D", null, null,true ));

    // =========/ Events

  });

  function updateRoom() {
    for ( var j = 0; j < mRegions.length; j++) {
      if (mRegions[j].major === $scope.mNearestBeacon.major) {
        $scope.mNearestRoom = mRegions[j];
        me.rooms = $scope.mNearestRoom;
        break;
      }else {
        $scope.mNearestRoom = noRoomFound;
        me.rooms = $scope.mNearestRoom;
        console.log(noRoomFound);
        console.log(" I was called");
      }
    }
    $scope.$apply();
  }
  //Set time interval and keep excuting every 5 secs
  setInterval(updateRoom, 5000);

  setInterval(function(){
    var posOptions = {timeout: 10000, enableHighAccuracy: false};
    var lat;
    var long;

    $cordovaGeolocation.getCurrentPosition(posOptions).then(function (position) {
      lat  = position.coords.latitude;
      long = position.coords.longitude;

    }, function(err) {
      // error
      lat  = '45.416667';
      long = '-75.7';
    });
    var newMember = {
      firstname: $scope.userInfo.firstname,
      email:  $scope.userInfo.email,
      lat: lat,
      long: long,
      roomName: $scope.mNearestRoom.id,
      major: $scope.mNearestRoom.major
    };

    SocketService.emit('join', newMember);
    $scope.testLocations +=1;
    console.log("coordinate was called");
    $scope.$apply();
  }, 5000); // Set time interval and keep excuting every 5 secs

  SocketService.on('joined', function(users) {
    $scope.mNearestUsers = users;
    $scope.testUpdateRoom +=1;

    $scope.$apply();
    updateStamp();
  });

  function updateStamp(){
      for ( var k = 0; k < $scope.mNearestUsers.length; k++) {
        if ($scope.mNearestUsers[k].firstname === $scope.userInfo.firstname) {
          $scope.mCurrentUserStamp = $scope.mNearestUsers[k];
        }else {
          $scope.mCurrentUserStamp = noRoomFound;
        }
      }
      $scope.$apply();
  }

}


module.exports = ['$scope', '$ionicModal', '$timeout','$location',
                  '$stateParams', '$rootScope', '$ionicPopup', '$ionicPlatform',
                  '$cordovaBeacon', 'LoginService', '$state', 'localStorageService',
                  'SocketService','$cordovaGeolocation', 'AUTH_EVENTS', HomeController];
