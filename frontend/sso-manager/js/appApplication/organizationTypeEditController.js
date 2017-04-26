'use strict';

angular.module('MainApp.applicationOrgTypeEdit', [])
    .controller('applicationOrgTypeEditCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'applicationOrgTypeEditService', '$state', function($scope, i18nService, $loading, $stateParams, sweet, applicationOrgTypeEditService, $state) {

        // 没有获取到,则是新增
        $scope.id = $stateParams.id;

        $scope.appId = $stateParams.appId;

        $scope.orgType = {};

        applicationOrgTypeEditService.getOrganizationType($scope.id).then(function (result) {
            $scope.orgType  = result;
        })

        $scope.save = function () {
            applicationOrgTypeEditService.editOrganizationType($scope.orgType).then(function (result) {
                $scope.back();
            });
        }


        $scope.back = function () {
            $state.go('sso.application.orgType',{'id':$scope.appId});
        }


    }])
    .factory('applicationOrgTypeEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _organizationTypeService = baseRestService.all('organization-type');

        service.editOrganizationType = function (orgType) {
            return orgType.put();
        }

        service.getOrganizationType = function (id) {
            return _organizationTypeService.get(id, {});
        }

        return service;
    }]);
