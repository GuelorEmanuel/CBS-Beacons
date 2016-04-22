'use strict';

require('angular');
require('ionic');

require('./modules/login/login');
require('./modules/register/register');
require('./modules/home/home');


module.exports = angular.module('starter', [
    'ionic',
    'ngCordova',
    'login',
    'register',
    'home'
  ])

  .constant('AUTH_EVENTS',{
    notAuthenticated: 'auth-not-authenticated'
  })

  .constant('API_ENDPOINT', {
    url: 'http://192.168.1.8:3000/api'
  })

  .config(require('./router'))

  .run(require('./app-main'))

  .factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
  return {
    responseError: function (response) {
      $rootScope.$broadcast({
        401: AUTH_EVENTS.notAuthenticated
      }[response.status], response);
      return $q.reject(response);
    }
  };
})

.config(function ($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
})

.run(function ($rootScope, $state, LoginService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!LoginService.isAuthenticated()) {
      if (next.name !== 'outside.login' && next.name !== 'outside.register' &&
          next.name !== 'outside.index' ) {

        event.preventDefault();
        $state.go('outside.index');
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

})

.run(function($ionicPlatform, $ionicPopup){
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
})

.run(function($ionicPlatform, $ionicPopup){
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
