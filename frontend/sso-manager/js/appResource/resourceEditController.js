/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('resourceEditCtrl', ['$scope', '$state', '$stateParams', 'resourceEditService', function($scope, $state, $stateParams, resourceEditService) {

        $scope.id = $stateParams.id;

        $scope.resource = {};
        $scope.allChlidApplications = [];

        resourceEditService.getAllChildApplications().then(function(result) {
            $scope.allChlidApplications = result;
        });

        resourceEditService.getResource($scope.id).then(function(result) {
            $scope.resource = result;
        })

        $scope.edit = function() {
            resourceEditService.resourceEdit($scope.resource).then(function(result) {
                $state.go('sso.resource');
            })
        }

        $scope.goList = function() {
            $state.go('sso.resource');
        }

    }])
    .factory('resourceEditService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _resourceService = baseRestService.all('resource');
        var _applicationService = baseRestService.all('application');

        service.getResource = function(id) {
            return _resourceService.get(id);
        }

        service.resourceEdit = function(resource) {
            return resource.put();
        }

        service.getAllChildApplications = function() {
            return _applicationService.get('all/child', {}, {});
        }

        return service;
    }]);