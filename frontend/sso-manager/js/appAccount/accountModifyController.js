/**
 * Created by sunshun on 2016/10/25.
 */
'use strict';

angular.module('MainApp', [])
    .controller('accountModifyCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'accountModifyService', '$state',
        function($scope, i18nService, $loading, $stateParams, sweet, accountModifyService, $state) {

            // 没有获取到,则是新增
            $scope.accountId = $stateParams.id;

            $scope.title = '新增';

            $scope.account = {};

            if ($scope.accountId != null && $scope.accountId != undefined ) {
                $scope.title = '修改';

                accountModifyService.getAccount($scope.accountId).then(function (result) {
                    $scope.account = result.data;
                })
                
            }

            $scope.edit = function () {
                accountModifyService.updateAccount($scope.accountId, $scope.account).then(function (result) {
                    sweet.show('提示', '操作成功', 'success');
                    $scope.back();
                });
            }
            
            $scope.doAndOrUpdate = function () {
                if ($scope.accountId != null && $scope.accountId != undefined ) {
                    $scope.edit();
                }else {
                    $scope.save();
                }
            }

            $scope.back = function () {
                $state.go('sso.account');
            }


    }])
    .factory('accountModifyService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _accountService = baseRestService.all('account');

        var _organizationService = baseRestService.all('organization');

        service.updateAccount = function (id, account) {
            return _accountService.customPUT(account, id);
        }

        service.getAccount = function (id) {
            return _accountService.get(id, {});
        }

        service.getOrganization = function () {
            return _organizationService.get('', {});
        }

        return service;
    }]);
