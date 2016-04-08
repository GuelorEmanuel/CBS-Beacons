'use strict';

require('angular');
require('ionic');

require('./modules/login/login');
require('./modules/register/register');
require('./modules/dashboard/dashboard');

module.exports = angular.module('starter', [
    'ionic',
    'login',
    'register',
    'dashboard'
  ])
  .config(require('./router'))
  .run(require('./app-main'))
;
