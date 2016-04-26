'use strict';

module.exports = angular.module('register', [])
	.controller('RegisterController', require('./register-controller'))
	.factory('LoginService', require('../interceptors/auth'));		
