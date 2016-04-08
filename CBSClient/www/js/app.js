'use strict';

require('angular');
require('ionic');

require('./modules/login/login');
require('./modules/register/register');
require('./modules/dashboard/dashboard');
require('./modules/nurse/nurse');
require('./modules/help/help');
require('./modules/donations/donations');

module.exports = angular.module('starter', [
    'ionic',
    'login',
    'register',
    'dashboard',
    'nurse',
    'help',
    'donations'
  ])
  .config(require('./router'))
  .run(require('./app-main'))
;
