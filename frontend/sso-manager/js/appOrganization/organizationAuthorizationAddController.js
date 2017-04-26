/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp.organizationAuthorizationAdd', [])
    .controller('organizationAuthorizationAddCtrl', ['$scope', 'sweet','$stateParams','i18nService', '$loading', 'organizationAuthorizationAddService', '$state', function($scope,sweet,$stateParams,i18nService, $loading, organizationAuthorizationAddService, $state) {

        $scope.orgId = $stateParams.id;
        $scope.organizationAuthorization = {};
        $scope.organizationAuthorization.organizationId =  $stateParams.id;
        $scope.orgAuth = {};
        $scope.orgTypes = [];
        $scope.application = {};

        $scope.applicationList = new Array();
        $scope.organizationTypeList = new Array();

        organizationAuthorizationAddService.getApplications().then(function(result){
            $scope.applicationList = result;

        })


        $scope.getOrgType = function(){
            var obj = angular.fromJson($scope.application);
            organizationAuthorizationAddService.getOrgType(obj.appKey).then(function(result){
                $scope.organizationTypeList = result;
            })
        }



        $scope.save = function(){

            var obj = angular.fromJson($scope.application);
            $scope.organizationAuthorization.appId = obj.appId;

            if(!$scope.organizationAuthorization.appId){
                sweet.show({
                    title: '提示',
                    text: '请选择应用!'
                });
                return;
            }

            if(!$scope.organizationAuthorization.organizationType.id){
                sweet.show({
                    title: '提示',
                    text: '请选择机构类型'
                });
                return;
            }


            organizationAuthorizationAddService.addAuth($scope.organizationAuthorization).then(function(result){
                $scope.goList();
            });


        }

        $scope.goList = function(){
            $state.go('sso.organization.authorization',{'id':$scope.orgId});
        }


    }]).factory('organizationAuthorizationAddService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _organizationAuthorizationAddService = baseRestService.all('organization-authorization');

    var _organizationType = baseRestService.all('organization-type');

    var _applicationService = baseRestService.all('application')

    service.addAuth = function(organizationAuthorization){
        return _organizationAuthorizationAddService.post(organizationAuthorization);
    }

    service.getApplications = function(){
        return _applicationService.get('all');
    }

    service.getOrgType = function(appKey){
        return _organizationType.get('/list/app-key/'+appKey);
    }

    return service;
}]);
