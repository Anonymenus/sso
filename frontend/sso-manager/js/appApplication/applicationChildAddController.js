/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.applicationChildAdd', [])
    .controller('applicationChildAddCtrl', ['$scope','$state','$stateParams','applicationChildAddService',function($scope,$state,$stateParams,applicationChildAddService) {

        $scope.parentId = $stateParams.id;

        $scope.applicationChild = {};

        $scope.applicationChild.parentId =  $scope.parentId;

        $scope.applicationChild.appType = 'web';

        $scope.save = function(){


            applicationChildAddService.applicationChildAdd($scope.applicationChild).then(function(result){
                $state.go('sso.application.child',{'id':$scope.parentId});
            })
        }

        $scope.goList = function(){
            $state.go('sso.application.child',{'id':$scope.parentId});
        }

    }])
    .factory('applicationChildAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _applicationChildAddService = baseRestService.all('application');

        service.applicationChildAdd = function(applicationChild){
            return _applicationChildAddService.post(applicationChild);
        }

        return service;
    }]);