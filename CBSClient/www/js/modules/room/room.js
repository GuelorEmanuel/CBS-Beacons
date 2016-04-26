'use strict';

module.exports = angular.module('room', [])
	.controller('RoomController', require('./room-controller'))
	.service('SocketService', require('../services/SocketService'))
	.controller('HomeController', require('../home/home-controller'));
