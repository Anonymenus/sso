'use strict';

angular.module('MainApp.organizationAdd', [])
    .controller('organizationAddCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'organizationAddService', '$state', function($scope, i18nService, $loading, $stateParams, sweet, organizationAddService, $state) {

        $scope.organization = {};

        $scope.save = function () {

            organizationAddService.saveOrganization($scope.organization).then(function (result) {

                $scope.goList();

            });
        }


        $scope.goList = function () {
            $state.go('sso.organization');
        }


    }])
    .factory('organizationAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _organizationAddService = baseRestService.all('organization');

        service.saveOrganization = function (organization) {
            return _organizationAddService.post(organization);
        }

        return service;
    }]);
