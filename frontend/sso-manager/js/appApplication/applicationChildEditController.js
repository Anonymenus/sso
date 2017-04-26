/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.applicationChildEdit', [])
    .controller('applicationChildEditCtrl', ['$scope','$state','$stateParams','applicationChildEditService',function($scope,$state,$stateParams,applicationChildEditService) {

        $scope.id = $stateParams.id;

        $scope.parentId = $stateParams.parentId;

        $scope.applicationChild = {};

        applicationChildEditService.getApplicationChild($scope.id).then(function(result){
            $scope.applicationChild = result;
        });

        $scope.save = function(){

            applicationChildEditService.applicationChildEdit($scope.applicationChild).then(function(result){
                $state.go('sso.application.child',{'id':$scope.parentId});
            })
        }

        $scope.goList = function(){
            $state.go('sso.application.child',{'id':$scope.parentId});
        }

    }])
    .factory('applicationChildEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _applicationChildEditService = baseRestService.all('application');

        service.getApplicationChild = function(id){
            return _applicationChildEditService.get(id);
        }

        service.applicationChildEdit = function(applicationChild){
            return applicationChild.put();
        }

        return service;
    }]);