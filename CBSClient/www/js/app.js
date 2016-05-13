'use strict';

require('angular');
require('ionic');


require('./modules/login/login');
require('./modules/register/register');
require('./modules/home/home');
require('./modules/map/map');
require('./modules/room/room');
require('./modules/menu/menu');

module.exports = angular.module('starter', [
    'ionic',
    'ionic.service.core',
    'ngCordova',
    'uiGmapgoogle-maps',
    'home',
    'login',
    'register',
    'map',
    'btford.socket-io',
    'angularMoment',
    'LocalStorageModule',
    'ngStorage',
    'room',
    'menu'

  ])

  .constant('AUTH_EVENTS',{
    notAuthenticated: 'auth-not-authenticated'
  })

  .constant('API_ENDPOINT', {
    url: 'http://159.203.18.207:3000/api'
    //172.17.123.206
  })

  .config(function(uiGmapGoogleMapApiProvider) {
    uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBCn8n-MFyn_dz63bV670FLdv6LZB6MFRc',
      v: '3.17',
      libraries: 'weather,geometry,visualization',
      language: 'en',
      sensor: 'false',
    });
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
});
