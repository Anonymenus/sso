'use strict';

angular.module('MainApp.organizationEdit', [])
    .controller('organizationEditCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'organizationEditService', '$state', function($scope, i18nService, $loading, $stateParams, sweet, organizationEditService, $state) {

        $scope.id = $stateParams.id;


        $scope.organization = {};

        organizationEditService.getOrganization($scope.id).then(function(result){
            $scope.organization = result;
        });

        $scope.save = function () {

            organizationEditService.editOrganization($scope.organization).then(function (result) {

                $scope.goList();

            });
        }


        $scope.goList = function () {
            $state.go('sso.organization');
        }


    }])
    .factory('organizationEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _organizationEditService = baseRestService.all('organization');

        service.editOrganization = function (organization) {
            return organization.put();
        }

        service.getOrganization = function(id){
            return _organizationEditService.get(id);
        }

        return service;
    }]);
