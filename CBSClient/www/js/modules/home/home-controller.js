/*
 * Home page Controller
 * by: Guelor Emanuel
 */
'use strict';

function HomeController($scope, $ionicModal, $timeout, $location,
                         $stateParams, $rootScope, $ionicPopup, $ionicPlatform,
                         $cordovaBeacon, LoginService, $state,
                         localStorageService, SocketFactory, $cordovaGeolocation,
                         AUTH_EVENTS) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  var brIdentifier = 'estimote';  // beacons Unique identifier name. Parameter is mandatory.
  //Unique proximity ID of the beacon being targeted.
  //This value must not be blank nor invalid as a UUID. Parameter is mandatory.
  var brUuid = '6557b1a8-c7ef-0fdf-c5c2-90ec325161d2';
  var brMajor = null; //The major value that you use to identify one or more beacons. Parameter is optional.
  var brMinor = null; // The minor value that you use to identify a specific beacon. Parameter is optional.
  //A Boolean indicating whether beacon notifications are sent when the device’s display is on. Parameter is optional.
  var brNotifyEntryStateOnDisplay = true;

  $scope.beacons = {};  // hold a dictionary of beacons found in the area
  var deviceInformation = ionic.Platform.isWebView(); // used for geting the device info of the user
  $scope.userInfo           = localStorageService.get(LoginService.getKey());
  $scope.deviceInfo      = deviceInformation; //@TODO can send this info to the server to be saved to db


	// Used for finding the  Nearest ranged beacon, room, users.
	$scope.mNearestBeacon = null;
  $scope.mNearestRoom = null;
  $scope.mNearestUsers = null;

  $scope.mCurrentUserStamp = null; // used for user time stamp

  // Here where the monitored regions are defined.
	// You can add as many beacons as you want to use.
	var mRegions =
	[
		{
			id: 'RegistrationRoom',
			uuid: "6557b1a8-c7ef-0fdf-c5c2-90ec325161d2",
			major: "53270",
			minor: "32099",
      pic: "RegistrationRoom.png",
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

  // default value when there is no beacon in the area
  var noRoomFound = {
                     id: 'noRoomFound',
                     uuid: "0",
                     major: "0",
                     minor: "0",
                     pic: "404.png",
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

  /*
   * Mehod for transitioning to the current beacons area for chatRoom
   * @param: room_name: String
   */
  $scope.enterRoom = function(room_name){
    me.current_room = room_name;
    localStorageService.set('room', room_name);
    var room = {
      'room_name': room_name
    };

    SocketFactory.emit('join:room', room);
    $state.go('cbs.room');
  };

  /*
   * Mehod for checking if user is still Authenticated(check if token is still valid)
   */
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    LoginService.logout();
    $state.go('outside.login');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });

  /*
   * Method for getting beacon uuid, major, and beacon minor
   * @param: beacon: Object
   * @return: String
   */
  function getBeaconId(beacon) {
		return beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
	}

  /*
   * Method for checking if two beacons are the same
   * @param: beacon1: Object, beacon2:Object
   * @return: boolean
   */
  function isSameBeacon(beacon1, beacon2) {
		return getBeaconId(beacon1) == getBeaconId(beacon2);
	}

  /*
   * Method for checking the closest beacons
   * @param: beacon1: Object, beacon2:Object
   * @return: beacon: Object
   */
  function isNearerThan(beacon1, beacon2) {
		return beacon1.accuracy > 0 &&
           beacon2.accuracy > 0 &&
           beacon1.accuracy < beacon2.accuracy;
	}

  /*
   * Method for getting the closet beacon to the user
   * @param: beacons: Dictionary
   */
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

  /*
   * Method for formatingDistance for accuracy
   * @param: meters: Any
   * @return: String
   */
  $scope.formatDistance = function(meters) {

    if (!meters) { return 'Unknown'; }

    if (meters > 1) {
      return meters.toFixed(3) + ' m';
		}
		else {
      return (meters * 100).toFixed(3) + ' cm';
    }
	};

  // Method execute when device is ready, or immediately if the device is already ready.
  // Can look up the documentation for $cordovaBeacon at http://ngcordova.com/docs/plugins/beacon/
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

    $scope.requestAlwaysAuthorization();

    $rootScope.$on("$cordovaBeacon:didStartMonitoringForRegion", function (event, pluginResult) {
      $scope.didStartMonitoringForRegionLog += '-----' + '\n';
      $scope.didStartMonitoringForRegionLog += JSON.stringify(pluginResult) + '\n';

      var uniqueBeaconKey;

      for (var i = 0; i < pluginResult.beacons.length; i++) {
        uniqueBeaconKey = getBeaconId(pluginResult.beacons[i]);

        $scope.beacons[uniqueBeaconKey] = pluginResult.beacons[i];
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
        }
        $scope.$apply();
    });

    $rootScope.$on('$cordovaBeacon:didEnterRegion', function(event, pluginResult) {

    });

    $rootScope.$on('$cordovaBeacon:didExitRegion', function(event, pluginResult) {

    });

    $scope.startRangingBeaconsInRegion();

  });

  /*
   * Method for updating the nearest room gets called every 5 seconds
   */
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
  setInterval(updateRoom, 5000);// Set time interval and keep excuting every 5 secs

  /*
   * Method for updating user current location, get called every 5 secs
   */
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

    SocketFactory.emit('join', newMember);
    $scope.$apply();
  }, 5000); // Set time interval and keep excuting every 5 secs

  // Method for listening for joined event emitted from the server, get the list
  // of user connected in the same area as the user
  SocketFactory.on('joined', function(users) {
    $scope.mNearestUsers = users;
    $scope.$apply();
    updateStamp();
  });

  // Method for updating user time stamp when login and when beacon location changes
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
                  'SocketFactory','$cordovaGeolocation', 'AUTH_EVENTS', HomeController];
