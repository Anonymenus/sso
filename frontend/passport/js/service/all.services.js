/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午10:09
 *
 */

(function () {
    'use strict';
    /**
     * 权限验证service
     */
    angular.module('app.services', ['ngCookies', 'LocalStorageModule','ngBiscuit'])
        .factory('Auth', ['$cookieStore', '$http', 'localStorageService','cookieStore', function ($cookieStore, $http, localStorageService,cookieStore) {
            var _ssoUser = {}, _ssoMenu = {};
            _ssoUser = angular.fromJson(cookieStore.get('ssoUser'));
            var setUser = function (user) {
                _ssoUser = user;
                 // cookieStore.put('user',_user,{domain:'.lngtop.com'});
                cookieStore.put('ssoUser', _ssoUser);
            }
            var setMenu = function (menu) {
                _ssoMenu = menu;
                if (localStorageService.isSupported) {
                    localStorageService.remove('menu');
                    localStorageService.set('menu', menu);
                }
            }


            return {
                isAuthorized: function (path) {
                    //权限菜单操作
                },
                setUser: setUser,
                setMenu: setMenu,
                isLoggerIn: function () {

                    return _ssoUser ? true : false;
                },
                getUser: function () {
                    return _ssoUser;
                },
                getId: function () {
                    return _ssoUser ? _ssoUser._id : null;
                },
                getName: function () {
                    return _ssoUser ? _ssoUser._name : null;
                },
                getCompany: function () {
                    return _ssoUser ? _ssoUser._company : null;
                },
                getMenu: function () {
                    return _ssoMenu ? _ssoMenu : null;
                },
                getToken: function () {
                    return _ssoUser ? _ssoUser._token : '';
                },
                logout: function () {
                    // $cookieStore.remove('user',{domain:'.lngtop.com'})
                    cookieStore.remove('ssoUser');
                    // $$cookieStore.remove('user');
                    _ssoUser = null;
                },
            }
        }])
        //拦截器
        .factory('interceptor', ['$q', '$rootScope', 'toaster', '$timeout','sweet', function ($q, $rootScope, toaster, $timeout,sweet) {
            var interceptor = {
                'request': function (config) {
                    config.headers['X-Lngtop-Application-Id'] = 'web';
                    return config;
                },
                'response': function (response) {

                    return response;
                },
                'responseError': function (rejection) {

                    switch (rejection.status) {
                        case 0:
                            toaster.clear();
                            toaster.pop('error', "0错误", '<ul><li>服务器连接失败！</li></ul>', 10000, 'trustedHtml');
                            break;
                        case 400:
                            var data = angular.fromJson(rejection.data);
                            sweet.show({
                                title: 'Error',
                                text: data.message,
                                timer: 2000,
                                showConfirmButton: false
                            });

                            // if (data.code && data.message) {
                            //     $rootScope.$broadcast('server:error');
                            //     toaster.clear();
                            //     toaster.pop('warning', "提示", '<ul><li>' + data.message + '</li></ul>', 10000, 'trustedHtml');
                            //     break;
                            // }
                            // toaster.pop('warning', "提示", '<ul><li>请求失败!</li></ul>', 10000, 'trustedHtml');
                            // break;
                        case 401:
                            var message = rejection.data.message;
                            sweet.show({
                                title: 'Error',
                                text: data.message,
                                timer: 2000,
                                showConfirmButton: false
                            });

                            // if (message.indexOf("name='loginRequired'") > 0 || message.indexOf("name='kickOut'") > 0 || message.indexOf("name='timeOut'") > 0) {
                            //     window.location.href = "./login"
                            // } else {
                            //     toaster.clear();
                            //     toaster.pop('error', "401错误", '<ul><li>' + rejection.data.message + '</li></ul>', 5000, 'trustedHtml');
                            // }
                            break;
                        case 403:
                            $rootScope.$broadcast('auth:forbidden');
                            toaster.clear();
                            toaster.pop('error', "错误", '<ul><li>禁止访问</li></ul>', 10000, 'trustedHtml');
                            break;
                        case 404:
                            $rootScope.$broadcast('page:notFound');
                            toaster.clear();
                            toaster.pop('warning', "Sorry", '<ul><li>网络似乎出现了一点小问题,请稍候访问!</li></ul>', 10000, 'trustedHtml');
                            break;
                        case 500:
                            $rootScope.$broadcast('server:error');
                            toaster.clear();
                            toaster.pop('warning', "Sorry!", '<ul><li>网络似乎出现了一点小问题,请稍候访问!</li></ul>', 10000, 'trustedHtml');
                            break;
                    }
                    return $q.reject(rejection);
                }
            }
            return interceptor;
        }])
       //restAngular 配置
        .factory('baseRestService', ['Restangular', 'sweet', '$loading', '$rootScope', '$compile', '$stateParams',
            function(Restangular, sweet, $loading, $rootScope, $compile, $stateParams) {

                Restangular.setRequestInterceptor(
                    function(element, operation, what, url) {
                        return element;
                    }
                );

                Restangular.setResponseInterceptor(
                    function(data, operation, what, url) {
                        return data;
                    }
                );

                return Restangular.withConfig(function(Configurer) {
                    var rpcUrl = LOGIN_URL + '/v1/';
                    Configurer.setBaseUrl(rpcUrl);
                });
            }
        ])
        /**
         * @Author   DongWenZhao
         * @DateTime 2016-05-17
         */
        .service('$loading', ['$rootScope', 'loadingOptions', function($rootScope, loadingOptions) {

            var self = this;
            self.setDefaultOptions = function(options) {
                extend(true, loadingOptions, options);
            };

            self.start = function(key) {
                $rootScope.$evalAsync(function() {
                    $rootScope.$broadcast('$loadingStart', key);
                });
            };

            self.update = function(key, options) {
                $rootScope.$evalAsync(function() {
                    $rootScope.$broadcast('$loadingUpdate', key, options);
                });
            };

            self.finish = function(key) {
                $rootScope.$evalAsync(function() {
                    $rootScope.$broadcast('$loadingFinish', key);
                });
            };
        }])
})();