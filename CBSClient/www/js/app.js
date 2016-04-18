'use strict';

require('angular');
require('ionic');

require('./modules/login/login');


module.exports = angular.module('starter', [
    'ionic',
    'login'
  ])

  .constant('AUTH_EVENTS',{
    notAuthenticated: 'auth-not-authenticated'
  })

  .constant('API_ENDPOINT', {
    url: 'http://159.203.18.207:3000/api'
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
