'use strict';

angular.module('MainApp', [])
    .controller('menuEditCtrl', ['$scope', '$state', '$stateParams', 'menuEditService', function($scope, $state,$stateParams, menuEditService) {
        $scope.id = $stateParams.id;
        $scope.menu = new Object();
        $scope.application = new Object();
        $scope.parentMenu = new Object();
        $scope.organizationTypeList = new Array();
        menuEditService.getMenu($scope.id).then(function(menu){
            menuEditService.getOrganizationTypeList(menu.appKey).then(function (data) {
                var orgType = new Object();
                orgType.code = "common";
                orgType.name = "通用";
                $scope.organizationTypeList.push(orgType);
                $.each(data, function(i,organizationType){
                    $scope.organizationTypeList.push(organizationType);
                });
                // $scope.menu = menu;
                if (menu.parentId >0){
                    menuEditService.getMenu(menu.parentId).then(function(parentMenu){
                        $scope.parentMenu = parentMenu;
                    });
                }else{
                    $scope.parentMenu.name = "无";
                }
                //TODO 
                menuEditService.getMenu($scope.id).then(function(menu2){
                    $scope.menu = menu2;
                });

            });
        });



        $scope.updateMenu = function() {
            menuEditService.updateMenu($scope.menu).then(function(result) {
                $state.go('sso.menu');
            })
        }
        $scope.goList = function() {
            $state.go('sso.menu');
        }
    }])
    .factory('menuEditService', ['baseRestService', function(baseRestService) {
        var service = {};
        var _menuService = baseRestService.all('menu');
        var _applicationService = baseRestService.all('application');
        var _organizationTypeService = baseRestService.all('organization-type');
        service.getMenu = function(menuId) {
            return _menuService.get(menuId);
        }
        service.updateMenu = function(menu) {
            return menu.put();
        }
        service.getApplication = function(appId){
            return _applicationService.get(appId);
        }

        service.getOrganizationTypeList = function (appKey) {
            return _organizationTypeService.get('list/app-key/'+appKey, {}, {});

        }

        return service;
    }]);