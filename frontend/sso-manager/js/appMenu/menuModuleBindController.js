/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.functionModuleBind', [])
    .controller('menuModuleBindCtrl', ['$scope', '$stateParams','$state', 'i18nService', '$loading', 'sweet', 'menuModuleBindService', function($scope, $stateParams,$state, i18nService, $loading, sweet, menuModuleBindService) {

        $scope.menuId = $stateParams.menuId;
        $scope.menu = new Object();
        $scope.functionModuleList = new Array();
        $scope.moduleBind = new Object();
        $scope.moduleBind.menuId = $scope.menuId;

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        $scope.loadData = function(){
            menuModuleBindService.getMenu($scope.menuId).then(function (menu) {
                $scope.menu = menu;
                menuModuleBindService.getFunctionModuleList($scope.menu.appId).then(function (functionModuleList) {
                    $scope.functionModuleList = functionModuleList;

                });
            });
        }
        $scope.loadData();

        $scope.saveFunctionModuleBind = function () {
            menuModuleBindService.saveFunctionModuleBind($scope.moduleBind).then(function (data) {
                $scope.goList();

            });

        }



        $scope.goList = function(){
            $state.go('sso.menu.functionModule', {
                'menuId': $scope.menuId
            });
        }


    }])
    .factory('menuModuleBindService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _functionModuleService = baseRestService.all('function-module');
        var _menuService = baseRestService.all('menu');
        service.getMenu = function(menuId) {
            return _menuService.get(menuId);
        }

        service.saveFunctionModuleBind = function(moduleBind) {
            return _functionModuleService.customPOST(moduleBind, 'bind', {}, {});
        }
        service.getFunctionModuleList = function(appId) {
            return _functionModuleService.get('app/'+appId+'/list');
        }
        return service;

    }]);