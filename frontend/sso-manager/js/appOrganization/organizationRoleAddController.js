'use strict';

angular.module('MainApp.organizationRoleAdd', [])
    .controller('organizationRoleAddCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'organizationRoleAddService', '$state', function($scope, i18nService, $loading, $stateParams, sweet, organizationRoleAddService, $state) {

        $scope.authId = $stateParams.id;

        $scope.orgId = $stateParams.orgId;

        $scope.organizationRole = {};

        $scope.save = function () {

            $scope.organizationRole.authId = $scope.authId;
            $scope.organizationRole.orgId = $scope.orgId;

            organizationRoleAddService.saveOrganizationRole($scope.organizationRole).then(function (result) {

                $scope.goList();

            });
        }


        $scope.goList = function () {
            $state.go('sso.organization.role',{'id':$scope.authId,'orgId':$scope.orgId});
        }


    }])
    .factory('organizationRoleAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _organizationRoleAddService = baseRestService.all('organization-role');

        service.saveOrganizationRole = function (organizationRole) {
            return _organizationRoleAddService.post(organizationRole);
        }

        return service;
    }]);
