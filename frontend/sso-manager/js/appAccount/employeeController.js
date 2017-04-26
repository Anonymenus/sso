/**
 * Created by sunshun on 2016/10/25.
 */

'use strict';

angular.module('MainApp', [])
    .controller('employeeCtrl', ['$scope', 'i18nService', '$loading', 'employeeService', '$state', 'sweet',
        function($scope, i18nService, $loading, employeeService, $state, sweet) {
            /*  变量初始化区域  start */
            //分页变量//
            $scope.currentPage = 1;
            $scope.numPages = 0;
            $scope.pageSize = 20;
            $scope.pages = [];

            $scope.gridApi = {};
            $scope.loading = true;

            $scope.totalItems = 0;
            // 关联机构对象
            $scope.org = {};
            // 关联账户对象
            $scope.account = {};

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        //产品列表数据载入方法//
         $scope.onSelectPage = function(page, pageSize) {
             employeeService.getEmployeeList(page, pageSize, $scope.keywords).then(function(result) {
                 $scope.employees = result.records;
                 $scope.totalpage = result.totalpage;
                 $scope.totalItems = result.totalitems;
                 $scope.numPages = result.totalpage;
                 $scope.currentPage = page;

         }).finally(function() {
                 $loading.finish('loading')
            })
         }

         //执行//
         $scope.onSelectPage(1, $scope.pageSize);

        /*  uiGrid初始化 start */

        /**
         * ui-grid使用
         * 1.配置options
         * @type {{useExternalPagination: boolean, paginationPageSizes: number[], paginationPageSize: *, totalItems: (number|*), columnDefs: *[], data: string}}
         */
        $scope.gridOptions = {
            useExternalPagination: true, //打开服务器分页
            paginationPageSizes: [20, 25, 50, 75], //每页显示多少条
            paginationPageSize: $scope.pageSize, //默认每页显示多少条
            columnDefs: [
                {field: 'name', displayName: '员工姓名', enableSorting: false, enableColumnMenu: false},
                {field: 'mobile', displayName: '手机', enableSorting: false, enableColumnMenu: false},
                {field: 'email', displayName: '邮箱', enableSorting: false, enableColumnMenu: false},
                {field: 'idcard', displayName: '身份证号码', enableSorting: false, enableColumnMenu: false},
                {field: 'officeNumber', displayName: '办公号码', enableSorting: false, enableColumnMenu: false},
                {field: 'homeNumber', displayName: '家庭电话', enableSorting: false, enableColumnMenu: false},
                {field: 'position', displayName: '职位', enableSorting: false, enableColumnMenu: false, cellFilter: 'employeePositionFilter'},
                {field: 'account.loginName', displayName: '关联账户', enableSorting: false, enableColumnMenu: false},
                {field: 'status', displayName: '状态', enableSorting: false, enableColumnMenu: false, cellFilter: 'employeeStatusFilter'},
                {field: 'organizationVo.name', displayName: '所属机构', enableSorting: false, enableColumnMenu: false},
                {field: 'address', displayName: '家庭住址', enableSorting: false, enableColumnMenu: false},
                {field: 'remark', displayName: '备注', enableSorting: false, enableColumnMenu: false},
                // {field: 'createTime', displayName: '创建时间', enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                // {field: 'createAccount', displayName: '创建人', enableSorting: false, enableColumnMenu: false},
                // {field: 'modifyTime', displayName: '修改时间', enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                // {field: 'modifyAccount', displayName: '修改人', enableSorting: false, enableColumnMenu: false},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    width: 280,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate:
                    '<button class="btn btn-default" ng-click="grid.appScope.showEdit(row)"><i class="fa fa-edit"></i>修改</button>' +
                    '<button class="btn btn-danger" ng-click="grid.appScope.deleteEmployee(row)"><i class="fa fa-edit"></i>删除</button>' +
                    '<button class="btn btn-default" ng-if="row.entity.status == 0" ng-click="grid.appScope.changeStatus(row, 1)"><i class="fa fa-edit"></i>启用</button>' +
                    '<button class="btn btn-danger" ng-if="row.entity.status == 1" ng-click="grid.appScope.changeStatus(row, 0)"><i class="fa fa-edit"></i>禁用</button>'
                }

            ],
            data: 'employees' //数据
        };

        /**
         * 2.配置gridApi
         * @param gridApi
         */
        $scope.gridOptions.onRegisterApi = function (gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function (pageNumber, pageSize) {
                $scope.onSelectPage(pageNumber, pageSize);
            });
        };
        /**
         * 3.watch totalItems的变化,然后赋值给ui-grid的数据总条数
         */
        $scope.$watch('totalItems', function (value) {
            if (value != undefined) {
                $scope.gridApi.grid.options.totalItems = value;
            }
        });

            /**
             * 新增
             */
            $scope.add = function () {
                $state.go('sso.employee.add');
            }
            /**
             * 修改
             */
            $scope.showEdit = function (row) {
                $state.go('sso.employee.edit', {"id": row.entity.id});
            }

            /**
             * 修改状态
             */
            $scope.changeStatus = function (row , status) {
                var id = row.entity.id;
                employeeService.updateEmployeeStatus(id, status).then(function (result) {
                    sweet.show('提示', '操作成功', 'success');
                    $scope.onSelectPage(1, $scope.pageSize);
                })
            }
            /**
             * 删除
             */
            $scope.deleteEmployee = function (row) {
                sweet.show({
                    title: '提示',
                    text: '确认删除？',
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#DD6B55',
                    confirmButtonText: '确认',
                    cancelButtonText: '取消',
                    closeOnConfirm: true
                },function () {
                    var id = row.entity.id;
                    employeeService.deleteEmployee(id).then(function (result) {
                        sweet.show('提示', '删除成功', 'success');
                        $scope.onSelectPage(1, $scope.pageSize);
                    })
                });
            }

        }]).factory('employeeService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _employeeService = baseRestService.all('employee');

    service.getEmployeeList = function(page, pageSize, keywords){
        return _employeeService.get('/page',{page: page, pageSize: pageSize, keywords: keywords});
    }

    service.updateEmployeeStatus = function (id, status) {
        return _employeeService.customPUT({}, id + '/status/' + status);
    }

    service.deleteEmployee = function (id) {
        return _employeeService.customDELETE(id);
    }

    return service;
}]);
