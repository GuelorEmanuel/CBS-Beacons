'use strict';


module.exports = ['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('outside', {
                url: '/outside',
                abstract: true,
                templateUrl: 'js/modules/outside/outside.html',
                controller: 'LoginController as loginController'
            })

            .state('outside.index', {
              url: '/index',
              templateUrl: 'js/modules/index/index.html'
            })

            .state('outside.login', {
                url: '/login',
                templateUrl: 'js/modules/login/login.html'
            })

            .state('outside.register', {
              url: '/register',
              templateUrl: 'js/modules/register/register.html',
              controller: 'RegisterController as registerController'
            })

            .state("cbs", {
              url: '/cbs',
              abstract: true,
              templateUrl: "js/modules/menu/menu.html",
              controller: "MenuController as menuController"
            })

            .state('cbs.home', {
              url: "/home",
              views: {
                'menuContent': {
                  templateUrl: "js/modules/home/home.html",
                  controller: "HomeController as homeController"
                }
              }
            })

            .state('cbs.map', {
              url: "/map",
              views: {
                'menuContent': {
                  templateUrl: "js/modules/map/map.html",
                  controller: "MapController as mapController"
                }
              }
            })

            .state('cbs.rooms', {
              url: "/rooms",
              views: {
                'menuContent': {
                  templateUrl: "js/modules/room/rooms.html",
                  controller: "HomeController as homeController"
                }
              }
            })

            .state('cbs.room', {
              url: "/room",
              views: {
                'menuContent': {
                  templateUrl: "js/modules/room/room.html",
                  controller: "RoomController as roomController"
                }
              }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/outside/index');
    }
];
