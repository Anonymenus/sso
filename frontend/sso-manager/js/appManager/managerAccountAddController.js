/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('managerAccountAddCtrl', ['$scope','$state','managerAccountAddService',function($scope,$state,managerAccountAddService) {

        $scope.managerAccount = {};

        $scope.managerAccount.type = 1;
        $scope.save = function(){


            managerAccountAddService.managerAccountAdd($scope.managerAccount).then(function(result){
                $state.go('sso.managerAccount');
            })
        }

        $scope.goList = function(){
            $state.go('sso.managerAccount');
        }

    }])
    .factory('managerAccountAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _managerAccountAddService = baseRestService.all('managerAccount');

        service.managerAccountAdd = function(managerAccount){
            return _managerAccountAddService.post(managerAccount);
        }

        return service;
    }]);