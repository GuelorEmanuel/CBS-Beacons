'use strict';

require('angular');
require('ionic');

require('./modules/login/login');
require('./modules/register/register');
require('./modules/nurse/nurse');
require('./modules/help/help');
require('./modules/donations/donations');
require('./modules/manage/manage');


module.exports = angular.module('starter', [
    'ionic',
    'login',
    'register',
    'nurse',
    'help',
    'donations',
    'manage'
  ])
  .config(require('./router'))
  .run(require('./app-main'))
;
