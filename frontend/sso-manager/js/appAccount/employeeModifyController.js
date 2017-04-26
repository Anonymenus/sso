/**
 * Created by sunshun on 2016/10/25.
 */
'use strict';

angular.module('MainApp', [])
    .controller('employeeModifyCtrl', ['$scope', 'i18nService', '$loading','$stateParams', 'sweet', 'employeeModifyService', '$state',
        function($scope, i18nService, $loading, $stateParams, sweet, employeeModifyService, $state) {

            // 没有获取到,则是新增
            $scope.employeeId = $stateParams.id;

            $scope.title = '新增';
            // 员工
            $scope.employee = {};

            // 加载 机构数据
            employeeModifyService.getOrganizationList().then(function (result) {
                $scope.organizationList = result.data;
            })

            if ($scope.employeeId != null && $scope.employeeId != undefined ) {
                $scope.title = '修改';

                employeeModifyService.getEmployee($scope.employeeId).then(function (result) {
                    $scope.employee = result.data;
                    
                })
            }

            $scope.save = function () {
                employeeModifyService.saveEmployee($scope.employee).then(function (result) {
                    sweet.show('提示', '操作成功', 'success');
                    $scope.back();
                });
            }

            $scope.edit = function () {
                employeeModifyService.updateEmployee($scope.employeeId, $scope.employee).then(function (result) {
                    sweet.show('提示', '操作成功', 'success');
                    $scope.back();
                });
            }
            
            $scope.doAndOrUpdate = function () {
                if ($scope.employeeId != null && $scope.employeeId != undefined ) {
                    $scope.edit();
                }else {
                    $scope.save();
                }
            }

            $scope.back = function () {
                $state.go('sso.employee');
            }


    }])
    .factory('employeeModifyService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _employeeService = baseRestService.all('employee');
        var _organizationService = baseRestService.all('organization');

        service.saveEmployee = function (employee) {
            return _employeeService.post(employee);
        }

        service.updateEmployee = function (id, employee) {
            return _employeeService.customPUT(employee, id);
        }

        // 加载员工
        service.getEmployee = function (id) {
            return _employeeService.get(id, {});
        }

        // 机构列表
        service.getOrganizationList = function () {
            return _organizationService.get('', {});
        }

        return service;
    }]);
