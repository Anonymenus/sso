'use strict';

angular.module('MainApp.applicationOrgTypeAdd', [])
    .controller('applicationOrgTypeAddCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'applicationOrgTypeAddService', '$state', function($scope, i18nService, $loading, $stateParams, sweet, applicationOrgTypeAddService, $state) {

        $scope.appId = $stateParams.id;


        $scope.orgType = {};

        $scope.orgType.appId = $scope.appId;


        $scope.save = function () {

            applicationOrgTypeAddService.saveOrganizationType($scope.orgType).then(function (result) {
                $scope.back();
            });
        }


        $scope.back = function () {
            $state.go('sso.application.orgType',{'id':$scope.appId});
        }


    }])
    .factory('applicationOrgTypeAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _applicationOrgTypeAddService = baseRestService.all('organization-type');

        service.saveOrganizationType = function (orgType) {
            return _applicationOrgTypeAddService.post(orgType);
        }

        return service;
    }]);
