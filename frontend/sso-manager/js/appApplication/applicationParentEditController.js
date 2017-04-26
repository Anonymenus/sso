/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.applicationParentEdit', [])
    .controller('applicationParentEditCtrl', ['$scope','$state','$stateParams','applicationParentEditService',function($scope,$state,$stateParams,applicationParentEditService) {

        $scope.id = $stateParams.id;

        $scope.applicationParent = {};

        applicationParentEditService.getApplicationParent($scope.id).then(function(result){
            $scope.applicationParent = result;
        });

        $scope.save = function(){

            applicationParentEditService.applicationParentEdit($scope.applicationParent).then(function(result){
                $state.go('sso.application');
            })
        }

        $scope.goList = function(){
            $state.go('sso.application');
        }

    }])
    .factory('applicationParentEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _applicationParentAddService = baseRestService.all('application');

        service.getApplicationParent = function(id){
            return _applicationParentAddService.get(id);
        }

        service.applicationParentEdit = function(applicationParent){
            return applicationParent.put();
        }

        return service;
    }]);