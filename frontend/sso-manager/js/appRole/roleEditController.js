/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('roleEditCtrl', ['$scope', '$state', '$stateParams', 'roleEditService', function($scope, $state, $stateParams, roleEditService) {

        $scope.id = $stateParams.id;

        $scope.role = {};
        $scope.allChlidApplications = [];
        $scope.organizationTypes = [];


        roleEditService.getAllChildApplications().then(function(result) {
            $scope.allChlidApplications = result;
        });

        roleEditService.getRole($scope.id).then(function(result) {
            $scope.role = result;
            $scope.getOrganizationTypes();
        })



        $scope.getOrganizationTypes = function() {
            roleEditService.getOrganizationTypes($scope.role.appKey).then(function(result) {
                $scope.organizationTypes = result;
            })
        }


        $scope.edit = function() {
            roleEditService.roleEdit($scope.role).then(function(result) {
                $state.go('sso.role');
            })
        }

        $scope.goList = function() {
            $state.go('sso.role');
        }

    }])
    .factory('roleEditService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _roleService = baseRestService.all('role');
        var _applicationService = baseRestService.all('application');
        var _organizationTypeService = baseRestService.all('organization-type');

        service.getRole = function(id) {
            return _roleService.get(id);
        }

        service.roleEdit = function(role) {
            return role.put();
        }

        service.getAllChildApplications = function() {
            return _applicationService.get('all/child', {}, {});
        }

        service.getOrganizationTypes = function(key) {
            return _organizationTypeService.get('/list/app-key/' + key, {}, {})
        }

        return service;
    }]);