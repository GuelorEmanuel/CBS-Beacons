'use strict';

module.exports = angular.module('home', [])
	.controller('HomeController', require('./home-controller'))
	.factory('SocketFactory', require('../services/SocketService'))
	.factory('LoginService', require('../interceptors/auth'))
	.run(function($ionicPlatform, $ionicPopup){
	  $ionicPlatform.ready(function(){
	    cordova.plugins.BluetoothStatus.initPlugin();

	    window.addEventListener('BluetoothStatus.disabled', function(){ // event listen for bluetooth
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

	    cordova.plugins.locationManager.isBluetoothEnabled() // check if bluetooth is enabled
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
