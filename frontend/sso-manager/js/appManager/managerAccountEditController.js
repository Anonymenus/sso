/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('managerAccountEditCtrl', ['$scope','$state','$stateParams','managerAccountEditService',function($scope,$state,$stateParams,managerAccountEditService) {

        $scope.id = $stateParams.id;

        $scope.managerAccount = {};

        managerAccountEditService.getManagerAccount($scope.id).then(function(result){
            $scope.managerAccount = result;
        })

        $scope.save = function(){


            managerAccountEditService.managerAccountEdit($scope.managerAccount).then(function(result){
                $state.go('sso.managerAccount');
            })
        }

        $scope.goList = function(){
            $state.go('sso.managerAccount');
        }

    }])
    .factory('managerAccountEditService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _managerAccountEditService = baseRestService.all('managerAccount');

        service.getManagerAccount = function(id){
            return _managerAccountEditService.get(id);
        }

        service.managerAccountEdit = function(managerAccount){
            return managerAccount.put();
        }

        return service;
    }]);