'use strict';

angular.module('MainApp.resourceAdd', [])
    .controller('resourceAddCtrl', ['$scope', '$state', '$stateParams','resourceAddService', function($scope, $state, $stateParams,resourceAddService) {

        $scope.appId = $stateParams.appId;

        $scope.parentId = $stateParams.parentId;

        $scope.resource = {};


        $scope.save = function() {

            $scope.resource.appId = $scope.appId;

            resourceAddService.resourceAdd($scope.resource).then(function(result) {
                $state.go('sso.application.resource',{'appId':$scope.appId,'parentId':$scope.parentId});
            })
        }

        $scope.goList = function() {
            $state.go('sso.application.resource',{'appId':$scope.appId,'parentId':$scope.parentId});
        }

    }])
    .factory('resourceAddService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _resourceAddService = baseRestService.all('resource');


        service.resourceAdd = function(resource) {
            return _resourceAddService.post(resource);
        }

        return service;
    }]);