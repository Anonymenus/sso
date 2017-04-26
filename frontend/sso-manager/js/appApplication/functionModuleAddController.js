/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.functionModuleAdd', [])
    .controller('functionModuleAddCtrl', ['$scope','$state','$stateParams','functionModuleAddService',function($scope,$state,$stateParams,functionModuleAddService) {

        $scope.appId = $stateParams.appId;

        $scope.parentId = $stateParams.parentId;

        $scope.functionModule = {};


        $scope.save = function(){

            $scope.functionModule.appId = $scope.appId;

            functionModuleAddService.functionModuleAdd($scope.functionModule).then(function(result){
                $state.go('sso.application.functionModule',{'appId':$scope.appId,'parentId':$scope.parentId});
            })
        }

        $scope.goList = function(){
            $state.go('sso.application.functionModule',{'appId':$scope.appId,'parentId':$scope.parentId});
        }

    }])
    .factory('functionModuleAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _functionModuleAddService = baseRestService.all('function-module');

        service.functionModuleAdd = function(functionModule){
            return _functionModuleAddService.post(functionModule);
        }

        return service;
    }]);