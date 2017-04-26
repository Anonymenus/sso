'use strict';

angular.module('MainApp', [])
    .controller('roleAddCtrl', ['$scope', '$state', 'roleAddService', function($scope, $state, roleAddService) {

        $scope.role = {};
        $scope.allParentApplicationList = [];
        $scope.organizationTypes = [];



        roleAddService.getAllParentApplicationList().then(function(result) {
            $scope.allParentApplicationList = result;
        });


        $scope.save = function() {
            roleAddService.roleAdd($scope.role).then(function(result) {
                $state.go('sso.role');
            })
        }



        $scope.getOrganizationTypes = function() {
            roleAddService.getOrganizationTypes($scope.role.appKey).then(function(result) {
                $scope.organizationTypes = new Array();
                var category = new Object();
                category.code = "common";
                category.name = "通用";
                $scope.organizationTypes.push(category);
                $.each(result,function (i, res) {
                    $scope.organizationTypes.push(res);
                });
                $scope.organizationTypes.push(result);
            })
        }



        $scope.goList = function() {
            $state.go('sso.role');
        }

    }])
    .factory('roleAddService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _roleAddService = baseRestService.all('role');

        var _applicationService = baseRestService.all('application');

        var _organizationTypeService = baseRestService.all('organization-type');


        service.roleAdd = function(role) {
            return _roleAddService.post(role);
        }



        service.getAllParentApplicationList = function() {
            return _applicationService.get('', {}, {});
        }


        service.getOrganizationTypes = function(key) {
            return _organizationTypeService.get('/list/app-key/' + key, {}, {})
        }



        return service;
    }]);