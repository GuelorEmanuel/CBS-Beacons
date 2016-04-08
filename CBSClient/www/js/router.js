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

            .state('outside.nurse', {
                url: '/nurse',
                templateUrl: 'js/modules/nurse/nurse.html',
                controller: "NurseController as nurseController"
            })


            .state('outside.register', {
                url: '/register',
                templateUrl: 'js/modules/register/register.html',
                controller: 'RegisterController as registerController'
            });
        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/outside/login');
    }
];