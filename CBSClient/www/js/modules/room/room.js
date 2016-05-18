'use strict';

module.exports = angular.module('room', [])
	.controller('RoomController', require('./room-controller'))
	.service('SocketFactory', require('../services/socketService'))
	.controller('HomeController', require('../home/home-controller'));
