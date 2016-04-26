'use strict';

module.exports = angular.module('home', [])
	.controller('HomeController', require('./home-controller'))
	.service('SocketService', require('../services/SocketService'))
	.factory('LoginService', require('../interceptors/auth'));
