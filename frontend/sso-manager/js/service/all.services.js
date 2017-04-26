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
    angular.module('app.services', ['ngCookies', 'LocalStorageModule'])
        .factory('Auth', ['$cookieStore', '$http', 'localStorageService', function ($cookieStore, $http, localStorageService) {
            var _ssoUser = {}, _ssoMenu = {}, _ssoRes = {}, _ssoCount = 0;
            _ssoUser = angular.fromJson($cookieStore.get('user'));
            _ssoCount = angular.fromJson($cookieStore.get('count'));
            //检测浏览器本地存储 - 获取时判断
            if (localStorageService.isSupported) {
                _ssoMenu = localStorageService.get('menu');
                if (_ssoMenu == null || _ssoMenu == '' || _ssoMenu == undefined) {
                    if (_ssoUser != null) {
                        //获取菜单操作
                    }
                }
            } else {
                //获取菜单操作
            }

            var setUser = function (user) {
                _ssoUser = user;
                $cookieStore.put('user', _ssoUser);
            }

            var setMenu = function (menu) {
                _ssoMenu = menu;
                if (localStorageService.isSupported) {
                    localStorageService.remove('menu');
                    localStorageService.set('menu', menu);
                }
            }

            var setCount = function (count) {
                _ssoCount = count;
                $cookieStore.put('count', _ssoCount);
            }

            return {
                isAuthorized: function (path) {
                    //权限菜单操作
                },
                setUser: setUser,
                setMenu: setMenu,
                setCount: setCount,
                isLogin: function () {

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
                    return _ssoUser ? _ssoUser.token : '';
                },
                logout: function () {
                    // $cookieStore.remove('user',{domain:'.lngtop.com'})
                    $cookieStore.remove('user');
                    // $$cookieStore.remove('user');
                    _ssoUser = null;
                },
            }
        }])
        //拦截器
        .factory('interceptor', ['$q', '$rootScope', 'toaster', '$timeout', function ($q, $rootScope, toaster, $timeout) {
            var interceptor = {
                'request': function (config) {
                    config.headers['X-Lngtop-Application-Id'] = 'web';
                    if ($rootScope.token != null && $rootScope.token != 'undefined') {
                        config.headers['X-Lngtop-Session-Token'] = $rootScope.token;
                    }
                    // config.headers['X-Lngtop-Session-Token'] = '123';
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
                            var data = rejection.data;
                            if (data.code && data.message) {
                                $rootScope.$broadcast('server:error');
                                toaster.clear();
                                toaster.pop('warning', "提示", '<ul><li>' + data.message + '</li></ul>', 10000, 'trustedHtml');
                                break;
                            }
                            toaster.pop('warning', "提示", '<ul><li>请求失败!</li></ul>', 10000, 'trustedHtml');
                            break;
                        case 401:
                            var message = rejection.data.message;
                             toaster.pop('error', "401错误", '<ul><li>' + rejection.data.message + '</li></ul>', 5000, 'trustedHtml');
                              window.location.href = "#/login"
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
                        // console.info(operation,what)
                        if (what == "adrange" || what == "adrange/check") {
                            return data;
                        }
                        if (operation == 'getList') {
                            // maya.notice.close();
                            //console.info(what);
                            var list = data["records"];
                            if (!list) {
                                list = data[what + "_list"];
                                if (!list) {
                                    list = data["messagePushs"];
                                    if (what == 'market/page' || what == 'normal/page' || what == 'customer/page') {
                                        list = data['transactionFlows'];
                                    }
                                    if (what == 'tcrecord' || what == 'fillingrecord') {
                                        list = data['records'];
                                    }
                                    if (what == 'statistics') {
                                        list = data['statistics'];
                                    }

                                    if (what == 'pay/transaction') {
                                        list = data['recharges'];
                                    }

                                    if (what == 'submitted') {
                                        list = data['withdrawApplys'];
                                    }
                                    if (what == 'pricing-package-apply') {
                                        list = data['packageApplies'];
                                    }
                                    if (what == 'operate') {
                                        list = data['records'];
                                    }
                                    if (what == 'patrolPoint'){
                                        list = data['patrolPoints'];
                                    }
                                    if (what == 'patrolTask'){
                                        list = data['patrolTasks'];
                                    }

                                }
                            }
                            if (list) {
                                list.totalpage = data['totalpage'];
                                list.totalitems = data['totalElements'];
                            }
                            return list;
                        } else if (operation == 'post' || operation == 'put' || operation == 'remove') {
                            what = String(what);
                            if (data['message']) {
                                if (what.indexOf('vehicle') > 0 || what.indexOf('savedetailandconfirmsend') > 0 || what.indexOf('sendplanvolume') > 0 || what.indexOf('monitormodule') >= 0 || what.indexOf('/employee/') > 0) {
                                    return data;
                                }

                                if ($.isEmptyObject((data['noTip']))) {
                                    sweet.show({
                                        title: '提示',
                                        text: data['message'],
                                        showCancelButton: false,
                                        confirmButtonColor: '#DD6B55',
                                        confirmButtonText: '确定',
                                        closeOnConfirm: false
                                    })
                                }
                            }

                        } else if (operation == 'get') {
                            if ($stateParams.id == undefined) {
                                if (what == 'page'||what == 'pages'||what == 'pageAll' ||what=='unbindPage'||what=='bindPage'
                                    || what == 'list' || what == 'getApplicationList' || what=='stopped' || what == 'patrolPoint' || what == 'patrolTask') {
                                    if (data.records) {
                                        // console.info(data.records)
                                        if (data.records.length == 0) {
                                            if(url.indexOf('customerTransfer/list') > -1){
                                                return data;
                                            }
                                            var msg = '没有查询到符合条件的记录';
                                            var template = '<div class="toast-text"><img src="../../images/errors.png" width="40" height="40"> <span class="toast-msg ng-binding">' + msg + '</span> </div>'
                                            var tmpl = angular.element(template);
                                            angular.element('.table-uigrid').append(tmpl);
                                        } else {
                                            angular.element('.toast-text').remove();
                                        }
                                    }
                                }

                            }

                        }
                        return data;
                    }
                );


                return Restangular.withConfig(function(Configurer) {
                    Configurer.setBaseUrl(API_BASE_URL);
                });
            }
        ])
        .factory('baseResourceService', ['Restangular', 'sweet', '$loading', '$rootScope', '$compile', '$stateParams',
            function(Restangular, sweet, $loading, $rootScope, $compile, $stateParams) {

                Restangular.setRequestInterceptor(
                    function(element, operation, what, url) {
                        return element;
                    }
                );

                Restangular.setResponseInterceptor(
                    function(data, operation, what, url) {
                        // console.info(operation,what)
                        if (what == "adrange" || what == "adrange/check") {
                            return data;
                        }
                        if (operation == 'getList') {
                            // maya.notice.close();
                            //console.info(what);
                            var list = data["records"];
                            if (!list) {
                                list = data[what + "_list"];
                                if (!list) {
                                    list = data["messagePushs"];
                                    if (what == 'market/page' || what == 'normal/page' || what == 'customer/page') {
                                        list = data['transactionFlows'];
                                    }
                                    if (what == 'tcrecord' || what == 'fillingrecord') {
                                        list = data['records'];
                                    }
                                    if (what == 'statistics') {
                                        list = data['statistics'];
                                    }

                                    if (what == 'pay/transaction') {
                                        list = data['recharges'];
                                    }

                                    if (what == 'submitted') {
                                        list = data['withdrawApplys'];
                                    }
                                    if (what == 'pricing-package-apply') {
                                        list = data['packageApplies'];
                                    }
                                    if (what == 'operate') {
                                        list = data['records'];
                                    }
                                    if (what == 'patrolPoint'){
                                        list = data['patrolPoints'];
                                    }
                                    if (what == 'patrolTask'){
                                        list = data['patrolTasks'];
                                    }

                                }
                            }
                            if (list) {
                                list.totalpage = data['totalpage'];
                                list.totalitems = data['totalElements'];
                            }
                            return list;
                        } else if (operation == 'post' || operation == 'put' || operation == 'remove') {
                            what = String(what);
                            if (data['message']) {
                                if (what.indexOf('vehicle') > 0 || what.indexOf('savedetailandconfirmsend') > 0 || what.indexOf('sendplanvolume') > 0 || what.indexOf('monitormodule') >= 0 || what.indexOf('/employee/') > 0) {
                                    return data;
                                }

                                if ($.isEmptyObject((data['noTip']))) {
                                    sweet.show({
                                        title: '提示',
                                        text: data['message'],
                                        showCancelButton: false,
                                        confirmButtonColor: '#DD6B55',
                                        confirmButtonText: '确定',
                                        closeOnConfirm: false
                                    })
                                }
                            }

                        } else if (operation == 'get') {
                            if ($stateParams.id == undefined) {
                                if (what == 'page'||what == 'pages'||what == 'pageAll' ||what=='unbindPage'||what=='bindPage'
                                    || what == 'list' || what == 'getApplicationList' || what=='stopped' || what == 'patrolPoint' || what == 'patrolTask') {
                                    if (data.records) {
                                        // console.info(data.records)
                                        if (data.records.length == 0) {
                                            if(url.indexOf('customerTransfer/list') > -1){
                                                return data;
                                            }
                                            var msg = '没有查询到符合条件的记录';
                                            var template = '<div class="toast-text"><img src="../../images/errors.png" width="40" height="40"> <span class="toast-msg ng-binding">' + msg + '</span> </div>'
                                            var tmpl = angular.element(template);
                                            angular.element('.table-uigrid').append(tmpl);
                                        } else {
                                            angular.element('.toast-text').remove();
                                        }
                                    }
                                }

                            }

                        }
                        return data;
                    }
                );


                return Restangular.withConfig(function(Configurer) {
                    Configurer.setBaseUrl(API_BASE_RESOURCE_URL);
                });
            }
        ])
        .service('NavSearch', [function() {
            this.toggle = toggle;
            this.dismiss = dismiss;

            ////////////////

            var navbarFormSelector = 'form.navbar-form';

            function toggle() {
                var navbarForm = $(navbarFormSelector);

                navbarForm.toggleClass('open');

                var isOpen = navbarForm.hasClass('open');

                //navbarForm.find('input')[isOpen ? 'focus' : 'blur']();
            }

            function dismiss() {
                $(navbarFormSelector)
                    .removeClass('open') // Close control
                    .find('input[type="text"]').blur() // remove focus
                //   .val('') // Empty input
            }
        }])
        .service('settingBox', [function() {
            this.toggle = toggle;
            this.dismiss = dismiss;

            ////////////////

            var navbarFormSelector = 'div.setting-box';

            function toggle() {
                var navbarForm = $(navbarFormSelector);

                navbarForm.toggleClass('open');

                var isOpen = navbarForm.hasClass('open');

                // navbarForm.find('input')[isOpen ? 'focus' : 'blur']();
            }

            function dismiss() {
                $(navbarFormSelector)
                    .removeClass('open') // Close control
                    .find('input[type="text"]').blur() // remove focus
                //   .val('') // Empty input
            }
        }])
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
        .factory('clipboard', ['$document', function($document) {
            function createNode(text, context) {
                var node = $document[0].createElement('textarea');
                node.style.position = 'absolute';
                node.textContent = text;
                node.style.left = '-10000px';
                if (context instanceof HTMLElement) {
                    node.style.top = context.getBoundingClientRect().top + 'px';
                }
                return node;
            }

            function copyNode(node) {
                try {
                    // Set inline style to override css styles
                    $document[0].body.style.webkitUserSelect = 'initial';

                    var selection = $document[0].getSelection();
                    selection.removeAllRanges();
                    node.select();

                    if (!$document[0].execCommand('copy')) {
                        throw ('failure copy');
                    }
                    selection.removeAllRanges();
                } finally {
                    // Reset inline style
                    $document[0].body.style.webkitUserSelect = '';
                }
            }

            function copyText(text, context) {
                var node = createNode(text, context);
                $document[0].body.appendChild(node);
                copyNode(node);
                $document[0].body.removeChild(node);
            }

            return {
                copyText: copyText,
                supported: 'queryCommandSupported' in document && document.queryCommandSupported('copy')
            };
        }]);
})();