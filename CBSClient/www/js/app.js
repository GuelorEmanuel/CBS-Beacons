'use strict';

require('angular');
require('ionic');

require('./modules/login/login');

module.exports = angular.module('starter', [
    'ionic',
    'login'
  ])
  .config(require('./router'))
  .run(require('./app-main'))
;
