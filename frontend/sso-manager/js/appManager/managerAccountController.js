/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('managerAccountCtrl', ['$scope', '$state','i18nService', '$loading','sweet','managerAccountService',function($scope, $state, i18nService,$loading,sweet,managerAccountService) {

        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.managerAccounts = [];

        $scope.loginName = "";

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');


        //载入数据
        $scope.onSelectPage = function (page) {
            managerAccountService.getPages(page,$scope.pageSize,$scope.loginName).then(function(result){
                $scope.managerAccounts = result.records;
                $scope.totalpage = result.totalpage;
                $scope.totalItems = result.totalElements;
                $scope.numPages = result.totalpage;
                $scope.currentPage = page;

            }).finally(function () {
                $loading.finish('loading')
            })
        }

        $scope.onSelectPage($scope.page);

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
                {field: 'id', displayName: 'ID', width:80,enableSorting: false, enableColumnMenu: false},
                {field: 'loginName', displayName: '登录名',enableSorting: false, enableColumnMenu: false},
                {field: 'type', displayName: '用户类型',enableSorting: false, cellFilter:'toManagerAccountType',enableColumnMenu: false},
                {field: 'createTime', displayName: '创建日期',cellFilter: 'toDateTime', enableSorting: false, enableColumnMenu: false}, {
                    field: 'caozuo',
                    displayName: '操作',
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.edit(row)"><i class="fa fa-edit"></i>修改</button>'
                }

            ],
            data: 'managerAccounts' //数据
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

        $scope.add = function(){
            $state.go('sso.managerAccount.add');
        }

        $scope.edit = function(row){
            var id = row.entity.id;
            $state.go('sso.managerAccount.edit',{'id':id});
        }


    }])
    .factory('managerAccountService', ['baseRestService', function (baseRestService) {

        var service = {};

        var _managerAccountService = baseRestService.all('managerAccount');

        service.getPages = function(page, pageSize,loginName){
            return _managerAccountService.get('page',{
                'page':page,
                'pageSize':pageSize,
                'loginName':loginName
            });
        }

        return service;

    }]);