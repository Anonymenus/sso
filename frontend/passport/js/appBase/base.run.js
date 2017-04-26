/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:44
 *
 */
'use strict';
angular.module('MainApp')
    .run(['$rootScope', function settingsRun($rootScope) {

        // Global Settings
        // -----------------------------------
        $rootScope.app = {
            name: '登录页面',
            description: '登录页面',
            year: ((new Date()).getFullYear()),
            layout: {
                isFixed: true,
                isCollapsed: false,
                isClose: false,
                isBoxed: false,
                theme: null
            },
            useFullLayout: false,
            hiddenFooter: false,
            offsidebarOpen: false,
            asideToggled: false,
            viewAnimation: 'ng-fadeInUp'
        };

        // Close submenu when sidebar change from collapsed to normal
        $rootScope.$watch('app.layout.isCollapsed', function(newValue) {
            if (newValue === false)
                $rootScope.$broadcast('closeSidebarMenu');
        });

    }])

angular.module('MainApp').run(['$rootScope', '$state', '$stateParams', '$window', '$location', 'Auth','$timeout', 'sweet', 'localStorageService', function($rootScope, $state, $stateParams, $window, $location, Auth,  $timeout, sweet, localStorageService) {
    $rootScope.token = Auth.getToken();
    $rootScope.user = Auth.getUser();
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
        var path = toState.name;
    });
    $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
        var path = toState.name;
        $window.scrollTo(0, 0); //跳转成功 初始化在顶部

        $rootScope.currTitle = $state.current.title; // 自定义标题
        $rootScope.pageTitle = function() {
            var title = $rootScope.app.name + '-' + ($rootScope.currTitle || $rootScope.app.description);
            document.title = title;
            return title;
        }
        $rootScope.pageTitle();
    });
}]);
