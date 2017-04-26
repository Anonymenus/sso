/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp.functionResourceAdd', [])
    .controller('functionResourceAddCtrl', ['$scope', 'sweet','$stateParams','i18nService', '$loading', 'functionResourceAddService', '$state', function($scope,sweet,$stateParams,i18nService, $loading, functionResourceAddService, $state) {

        $scope.functionId = $stateParams.functionId;

        $scope.appId = $stateParams.appId;

        $scope.parentId = $stateParams.parentId;

        $scope.resources = [];

        $scope.functionResource = {};


        functionResourceAddService.getResources($scope.appId).then(function(result){
            $scope.resources = result;
        })



        $scope.save = function(){

            $scope.functionResource.functionId = $scope.functionId;

            if(!$scope.resourceId){
                sweet.show({
                    title: '提示',
                    text: '请选择资源!'
                });
                return;
            }

            $scope.functionResource.resourceId = $scope.resourceId;

            functionResourceAddService.addFunctionResource($scope.functionResource).then(function(result){
                $scope.goList();
            });


        }

        $scope.goList = function(){
            $state.go('sso.application.functionResource',{'functionId':$scope.functionId,'appId':$scope.appId,'parentId':$scope.parentId});
        }


    }]).factory('functionResourceAddService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _functionResource = baseRestService.all('function-resource')
    var _resourceService = baseRestService.all('resource')



    service.getResources = function(id){
        return _resourceService.get('appId/'+id);
    }

    service.addFunctionResource = function(functionResource){
        return _functionResource.post(functionResource);
    }


    return service;
}]);
