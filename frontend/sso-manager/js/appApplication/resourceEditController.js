/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.resourceEdit', [])
    .controller('resourceEditCtrl', ['$scope', '$state', '$stateParams', 'resourceEditService', function($scope, $state, $stateParams, resourceEditService) {

        $scope.id = $stateParams.id;

        $scope.appId = $stateParams.appId;

        $scope.parentId = $stateParams.parentId;

        $scope.resource = {};

        resourceEditService.getResource($scope.id).then(function(result) {
            $scope.resource = result;
        })

        $scope.edit = function() {


            resourceEditService.resourceEdit($scope.resource).then(function(result) {
                $state.go('sso.application.resource',{'appId':$scope.appId,'parentId':$scope.parentId});
            })
        }

        $scope.goList = function() {
            $state.go('sso.application.resource',{'appId':$scope.appId,'parentId':$scope.parentId});
        }

    }])
    .factory('resourceEditService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _resourceService = baseRestService.all('resource');


        service.getResource = function(id) {
            return _resourceService.get(id);
        }

        service.resourceEdit = function(resource) {
            return resource.put();
        }


        return service;
    }]);