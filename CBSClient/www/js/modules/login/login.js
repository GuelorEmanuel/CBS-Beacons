'use strict';

module.exports = angular.module('login', [])
	.factory('LoginService', require('../interceptors/auth'))
	.controller('LoginController', require('./login-controller'));
