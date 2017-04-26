'use strict';

angular.module('MainApp', [])
    .controller('menuAddCtrl', ['$scope', '$state', '$stateParams', 'menuAddService', function($scope, $state,$stateParams, menuAddService) {
        $scope.pid = $stateParams.pid;
        $scope.appId = $stateParams.appId;
        $scope.application = '';
        $scope.parentMenu = new Object();
        $scope.organizationTypeList = new Array();
        $scope.menu = new Object();
        $scope.menu.parentId = $scope.pid;
        $scope.load = function(){
            if ($scope.pid < 0){
                $scope.parentMenu.name = "无";
            }
            menuAddService.getApplication($scope.appId).then(function(result){
                $scope.application = result;
                $scope.menu.appId = $scope.application.id;
                $scope.menu.appKey = $scope.application.appKey;
                $scope.menu.appType = $scope.application.appType;
                menuAddService.getOrganizationTypeList($scope.application.appKey).then(function (data) {
                    var orgType = new Object();
                    orgType.code = "common";
                    orgType.name = "通用";
                    $scope.organizationTypeList.push(orgType);
                    $.each(data, function(i,organizationType){
                        $scope.organizationTypeList.push(organizationType);
                    });
                    if ($scope.pid >0){
                        menuAddService.getMenu($scope.pid).then(function(result){
                            $scope.parentMenu = result;
                        });
                    }
                });
            });
        }
        $scope.load();

        $scope.saveMenu = function() {
            menuAddService.saveMenu($scope.menu).then(function(result) {
                $state.go('sso.menu');
            })
        }
        $scope.goList = function() {
            $state.go('sso.menu');
        }
    }])
    .factory('menuAddService', ['baseRestService', function(baseRestService) {
        var service = {};
        var _menuService = baseRestService.all('menu');
        var _applicationService = baseRestService.all('application');
        var _organizationTypeService = baseRestService.all('organization-type');
        service.getMenu = function(menuId) {
            return _menuService.get(menuId);
        }
        service.saveMenu = function(menu) {
            return _menuService.post(menu);
        }
        service.getApplication = function(appId){
            return _applicationService.get(appId);
        }

        service.getOrganizationTypeList = function (appKey) {
            return _organizationTypeService.get('list/app-key/'+appKey, {}, {});

        }

        return service;
    }]);