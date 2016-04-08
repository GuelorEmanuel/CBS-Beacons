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

            .state('outside.register', {
                url: '/register',
                templateUrl: 'js/modules/register/register.html'
            })

            .state('main', {
              url: '/',
              abstract: true,
              templateUrl: 'js/modules/home/home.html'
            })

            .state('main.dash', {
              url: 'main/dash',
              views: {
                'dash-tab': {
                  templateUrl: 'js/modules/dashboard/dashboard.html',
                  controller: 'DashBoardController as DashBoardController'
                }
              }
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/outside/login');
    }
];
