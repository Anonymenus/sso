/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp', [])
    .controller('accountCtrl', ['$scope', 'i18nService', '$loading', 'accountService', '$state',
        function($scope, i18nService, $loading, accountService, $state) {
            /*  变量初始化区域  start */
            //分页变量//
            $scope.currentPage = 1;
            $scope.numPages = 0;
            $scope.pageSize = 20;
            $scope.pages = [];

            $scope.gridApi = {};
            $scope.loading = true;

            $scope.totalItems = 0;
            // 机构对象
            $scope.org = {};

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        //产品列表数据载入方法//
         $scope.onSelectPage = function(page, pageSize) {
             accountService.getAccountList(page, pageSize, $scope.keywords).then(function(result) {
                 $scope.accounts = result.records;
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
                {field: 'loginName', displayName: '登录名', enableSorting: false, enableColumnMenu: false},
                {field: 'mobile', displayName: '手机', enableSorting: false, enableColumnMenu: false},
                {field: 'email', displayName: '邮箱', enableSorting: false, enableColumnMenu: false},
                {field: 'mobileValidate', displayName: '手机是否验证', enableSorting: false, enableColumnMenu: false, cellFilter: 'validateFilter'},
                {field: 'emailValidate', displayName: '邮箱是否验证', enableSorting: false, enableColumnMenu: false, cellFilter: 'validateFilter'},
                // {field: 'organization.name', displayName: '所属机构', enableSorting: false, enableColumnMenu: false},
                {field: 'status', displayName: '状态', enableSorting: false, enableColumnMenu: false, cellFilter: 'employeeStatusFilter'},
                // {field: 'createTime', displayName: '创建时间', enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                // {field: 'createAccount', displayName: '创建人', enableSorting: false, enableColumnMenu: false},
                // {field: 'modifyTime', displayName: '修改时间', enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                // {field: 'modifyAccount', displayName: '修改人', enableSorting: false, enableColumnMenu: false},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate:
                    '<button class="btn btn-infos" ng-click="grid.appScope.showEdit(row)"><i class="fa fa-edit"></i>修改</button>'
                }

            ],
            data: 'accounts' //数据
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
             * 修改
             */
            $scope.showEdit = function (row) {
                $state.go('sso.account.edit', {"id": row.entity.id});
            }

    }]).factory('accountService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _accountService = baseRestService.all('account');

    service.getAccountList = function(page, pageSize, keywords){
        return _accountService.get('/page',{page: page, pageSize: pageSize, keywords: keywords});
    }

    return service;
}]);
