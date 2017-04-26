/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:44
 *
 */
'use strict';
angular.module('MainApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider) {
        //去掉 '#'

        $urlRouterProvider.otherwise(function($injector) {
            $injector.get('$state').go('login')
        });
        // $locationProvider.html5Mode(true);
        $stateProvider
            .state('login', {
                url: '/login',
                title: '登录名',
                templateUrl: 'views/tplLogin/tpl_login.html',
                controller: 'loginCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([]).then(
                                function() {
                                    return $ocLazyLoad.load(['js/appLogin/loginController.js' + '?v=' + version]);
                                }
                            );
                        }
                    ]
                }
            })
            .state('forgetPass', {
                url: '/forgetPass/:appKey/:appType/:returnUrl',
                title: '忘记密码',
                templateUrl: 'views/tplLogin/tpl_forget_pass.html',
                controller: 'forgetPassCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([]).then(
                                function() {
                                    return $ocLazyLoad.load(['js/appLogin/forgetPassController.js' + '?v=' + version]);
                                }
                            );
                        }
                    ]
                }
            })
            .state('resetPass', {
                url: '/resetPass/:username/:appKey/:appType/:returnUrl',
                title: '简单密码修改',
                templateUrl: 'views/tplLogin/tpl_reset_pass.html',
                controller: 'resetPassCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([]).then(
                                function() {
                                    return $ocLazyLoad.load(['js/appLogin/resetPassController.js' + '?v=' + version]);
                                }
                            );
                        }
                    ]
                }
            })
            //http拦截器
        $httpProvider.interceptors.push('interceptor');

    }
]);
