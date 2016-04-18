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

            .state('outside.login', {
                url: '/login',
                templateUrl: 'js/modules/login/login.html'
            })

            .state('outside.index', {
              url: '/index',
              templateUrl: 'js/modules/index/index.html'
            })

            .state('outside.register', {
              url: '/register',
              templateUrl: 'js/modules/register/register.html'
            })

            .state("cbs", {
              url: '/cbs',
              abstract: true,
              templateUrl: "js/modules/menu/menu.html"
            })

            .state('cbs.home', {
              url: "/home",
              views: {
                'menuContent': {
                  templateUrl: "js/modules/home/home.html"
                }
              }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/outside/index');
    }
];
