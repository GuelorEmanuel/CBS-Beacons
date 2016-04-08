'use strict';

require('angular');
require('ionic');

require('./modules/login/login');
require('./modules/register/register');

module.exports = angular.module('starter', [
    'ionic',
    'login',
    'register'
  ])
  .config(require('./router'))
  .run(require('./app-main'))
;
