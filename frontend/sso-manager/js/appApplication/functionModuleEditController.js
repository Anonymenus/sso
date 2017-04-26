/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.functionModuleEdit', [])
    .controller('functionModuleEditCtrl', ['$scope','$state','$stateParams','functionModuleEditService',function($scope,$state,$stateParams,functionModuleEditService) {

        $scope.id = $stateParams.id;

        $scope.appId = $stateParams.appId;

        $scope.parentId = $stateParams.parentId;

        $scope.functionModule = {};

        functionModuleEditService.getFunctionModule($scope.id).then(function(result){
            $scope.functionModule = result;
        })

        $scope.save = function(){

            $scope.functionModule.appId = $scope.appId;

            functionModuleEditService.functionModuleEdit($scope.functionModule).then(function(result){
                $state.go('sso.application.functionModule',{'appId':$scope.appId,'parentId':$scope.parentId});
            })
        }

        $scope.goList = function(){
            $state.go('sso.application.functionModule',{'appId':$scope.appId,'parentId':$scope.parentId});
        }

    }])
    .factory('functionModuleEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _functionModuleEditService = baseRestService.all('function-module');

        service.getFunctionModule = function(id){
            return _functionModuleEditService.get(id);
        }

        service.functionModuleEdit = function(functionModule){
            return functionModule.put();
        }

        return service;
    }]);