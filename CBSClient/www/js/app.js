'use strict';

require('angular');
require('ionic');

require('./modules/login/login');
require('./modules/register/register');
require('./modules/nurse/nurse');


module.exports = angular.module('starter', [
    'ionic',
    'login',
    'register',
    'nurse'
  ])
  .config(require('./router'))
  .run(require('./app-main'))
;
