'use strict';

module.exports = angular.module('map', [])
	.controller('MapController', require('./map-controller'))
	.service('SocketService', require('../services/SocketService'));
