'use strict';

angular.module('MainApp', [])
    .controller('resourceAddCtrl', ['$scope', '$state', 'resourceAddService', function($scope, $state, resourceAddService) {

        $scope.resource = {};
        $scope.allChlidApplications = [];

        resourceAddService.getAllChildApplications().then(function(result) {
            $scope.allChlidApplications = result;
        });


        $scope.save = function() {
            resourceAddService.resourceAdd($scope.resource).then(function(result) {
                $state.go('sso.resource');
            })
        }

        $scope.goList = function() {
            $state.go('sso.resource');
        }

    }])
    .factory('resourceAddService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _resourceAddService = baseRestService.all('resource');

        var _applicationService = baseRestService.all('application');

        service.resourceAdd = function(resource) {
            return _resourceAddService.post(resource);
        }

        service.getAllChildApplications = function() {
            return _applicationService.get('all/child', {}, {});
        }



        return service;
    }]);