'use strict';

module.exports = angular.module('menu', [])
.controller('MenuController', require('./menu-controller'))
.factory('LoginService', require('../interceptors/auth'));
