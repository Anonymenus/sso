'use strict';

angular.module('MainApp.organizationRoleEdit', [])
    .controller('organizationRoleEditCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'organizationRoleEditService', '$state', function($scope, i18nService, $loading, $stateParams, sweet, organizationRoleEditService, $state) {

        $scope.id = $stateParams.id;

        $scope.authId = $stateParams.authId;

        $scope.orgId = $stateParams.orgId;

        $scope.organizationRole = {};

        organizationRoleEditService.getOrganizationRole($scope.id).then(function(result){
            $scope.organizationRole = result;
        })

        $scope.save = function () {


            organizationRoleEditService.updateOrganizationRole($scope.organizationRole).then(function (result) {

                $scope.goList();

            });
        }


        $scope.goList = function () {
            $state.go('sso.organization.role',{'id':$scope.authId,'orgId':$scope.orgId});
        }


    }])
    .factory('organizationRoleEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _organizationRoleEditService = baseRestService.all('organization-role');

        service.getOrganizationRole = function (id) {
            return _organizationRoleEditService.get(id);
        }

        service.updateOrganizationRole = function (organizationRole) {
            return organizationRole.put();
        }

        return service;
    }]);
