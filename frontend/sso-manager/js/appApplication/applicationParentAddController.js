/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.applicationParentAdd', [])
    .controller('applicationParentAddCtrl', ['$scope','$state','applicationParentAddService',function($scope,$state,applicationParentAddService) {

        $scope.applicationParent = {};


        $scope.applicationParent.appType = 'web';

        $scope.save = function(){


            applicationParentAddService.applicationParentAdd($scope.applicationParent).then(function(result){
                $state.go('sso.application');
            })
        }

        $scope.goList = function(){
            $state.go('sso.application');
        }

    }])
    .factory('applicationParentAddService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _applicationParentAddService = baseRestService.all('application');

        service.applicationParentAdd = function(applicationParent){
            return _applicationParentAddService.post(applicationParent);
        }

        return service;
    }]);