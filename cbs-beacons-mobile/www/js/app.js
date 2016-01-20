// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      //cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider
  .state('outside', {
    url: '/outside',
    abstract: true,
    templateUrl: 'templates/outside.html'
  })

  .state('outside.login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'BeaconCtrl'
  })

  .state('outside.register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'RegisterCtrl'
  })

  .state('main', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/main.html'
  })
  .state('main.dash', {
    url: 'main/dash',
    views: {
        'dash-tab': {
          templateUrl: 'templates/dashboard.html',
          controller: 'DashCtrl'
        }
    }
  })
  .state('main.public', {
    url: 'main/public',
    views: {
        'public-tab': {
          templateUrl: 'templates/public.html'
        }
    }
  });

  $urlRouterProvider.otherwise('/outside/login');
})

.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
      if (next.name !== 'outside.login' && next.name !== 'outside.register') {

        event.preventDefault();
        $state.go('outside.login');
      }
    }
  });
})

.run(function($ionicPlatform, $ionicPopup){
  document.addEventListener("resume", function(){
    $ionicPlatform.ready(function(){
      cordova.plugins.locationManager.isBluetoothEnabled()
      .then(function(isEnabled){
        console.log("isEnabled: " + isEnabled);
        if (isEnabled){
          //cordova.plugins.locationManager.disableBluetooth();
        }else {
          console.log("isDisabled");
        }
      })
      .fail(console.error)
      .done();

    });

  }, false);

}).run(function($ionicPlatform, $ionicPopup){
  $ionicPlatform.ready(function(){

    document.addEventListener("offline", function(){
      $ionicPopup.confirm({
        title: "Internet Disconnected",
        content: "The internet is disconnected on your device."
      })
      .then(function(result){
        if(!result){
          ionic.Platform.exitApp();
        }
      });

    }, false);

  });
}).run(function($ionicPlatform, $ionicPopup){
  $ionicPlatform.ready(function(){
    cordova.plugins.BluetoothStatus.initPlugin();

    window.addEventListener('BluetoothStatus.disabled', function(){
      $ionicPopup.confirm({
        title: "Bluetooth services Disabled",
        content: "Please enable Bluetooth services",
        cancelText: 'exit App',
        okText: 'enable'
      })
      .then(function(result){
        if(!result){
          ionic.Platform.exitApp();
        }else{
          cordova.plugins.locationManager.enableBluetooth(); //android only

        }
      });
    });

    cordova.plugins.locationManager.isBluetoothEnabled()
    .then(function(isEnabled){
      if(isEnabled){

      }else{
        $ionicPopup.confirm({
          title: "Bluetooth services Disabled",
          content: "Please enable Bluetooth services",
          cancelText: 'exit App',
          okText: 'enable'
        })
        .then(function(result){
          if(!result){
            ionic.Platform.exitApp();
          }else{
            cordova.plugins.locationManager.enableBluetooth(); //android only

          }
        });

      }
    })
    .fail(console.error)
    .done();

  });
});
