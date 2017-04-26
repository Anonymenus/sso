/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:43
 *
 */
'use strict';
angular.module('MainApp', ['ui.router',
    'oc.lazyLoad',
    'ui.bootstrap',
    'angular-loading-bar',
    'app.core',
    'app.sidebar',
    'app.utils',
    'app.services',
    'app.filters',
    'app.directives',
    'angularFileUpload',
    'restangular',
    'LocalStorageModule',
    'toaster',
    'hSweetAlert',
    'w5c.validator',
    'ui.select2',
    'angulartics',
    'angulartics.google.analytics'
]);
//添加版本号
var version = "1.0.0.1";
//  注册组件
var mainApp = angular.module('MainApp')
    .config(['$controllerProvider', '$compileProvider', '$filterProvider', '$provide', function($controllerProvider, $compileProvider, $filterProvider, $provide) {
        mainApp.controller = $controllerProvider.register;
        mainApp.directive = $compileProvider.directive;
        mainApp.filter = $filterProvider.register;
        mainApp.factory = $provide.factory;
        mainApp.service = $provide.service;
        mainApp.constant = $provide.constant;
        mainApp.value = $provide.value;
    }]);
mainApp.run(
    ['$rootScope', '$state', '$stateParams',
        function($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
        }
    ]
)
