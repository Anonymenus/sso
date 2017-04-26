/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp.organizationAuthorization', [])
    .controller('organizationAuthorizationCtrl', ['$scope','sweet','$stateParams','i18nService', '$loading', 'organizationAuthorizationService', '$state', function($scope,sweet,$stateParams,i18nService, $loading, organizationAuthorizationService, $state) {

        $scope.orgId = $stateParams.id;

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
        $scope.organizationAuthorizations = [];

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        //产品列表数据载入方法//
         $scope.onSelectPage = function(page) {
             organizationAuthorizationService.getOrganizationAuthorizations(page,$scope.pageSize,$scope.name,$scope.orgId).then(function(result) {
                 $scope.organizationAuthorizations = result.records;
                 $scope.totalpage = result.totalpage;
                 $scope.totalItems = result.totalitems;
                 $scope.numPages = result.totalpage;
                 $scope.currentPage = page;

         }).finally(function() {
                 $loading.finish('loading')
            })
         }

         //执行//
         $scope.onSelectPage(1);

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
                {field: 'appName', displayName: '应用名称', enableSorting: false, enableColumnMenu: false},
                {field: 'appKey', displayName: '应用Key',enableSorting: false, enableColumnMenu: false},
                {field: 'organizationType.name', displayName: '机构类型', enableSorting: false, enableColumnMenu: false},
                {field: 'createTime', displayName: '授权时间',enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    width: 400,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate:
                    '<button class="btn btn-infos" ng-click="grid.appScope.role(row)"><i class="fa fa-edit"></i>机构角色</button>'+
                    '<button class="btn btn-infos" ng-click="grid.appScope.menu(row)"><i class="fa fa-edit"></i>机构菜单</button>'
                }

            ],
            data: 'organizationAuthorizations' //数据
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
            $state.go('sso.organization.authAdd',{'id':$scope.orgId});
        }
        /**
         * 修改
         */
        $scope.showEdit = function (row) {
            $state.go('sso.organization.edit', {"id": row.entity.id});
        }

        $scope.goList = function(row){
            $state.go('sso.organization');
        }

        $scope.delete = function(row){


            sweet.show({
                title: '提醒',
                text: '删除后,该机构将没有应用的访问权限!是否确定删除?',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }, function() {
                organizationAuthorizationService.deleteOrganizationAuthorization(row.entity.id).then(function(res){
                    $scope.onSelectPage(1);
                })
            });


        }

        /**
         * 角色管理
         */
        $scope.role = function (row) {
            $state.go('sso.organization.role',{'appId':row.entity.appId,'orgId':$scope.orgId});
        }


        $scope.menu = function (row) {
            $state.go('sso.organization.organizationMenuTree',{'appId':row.entity.appId,'organizationId':$scope.orgId});
        }

    }]).factory('organizationAuthorizationService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _organizationAuthorizationService = baseRestService.all('organization-authorization');

    service.getOrganizationAuthorizations = function(page, pageSize,name,orgId){
        return _organizationAuthorizationService.get('/page',{'page': page, 'pageSize': pageSize,'name':name,'orgId':orgId});
    }

    service.getOrganizationAuthorization = function(id){
        return _organizationAuthorizationService.get(id);
    }

    service.deleteOrganizationAuthorization = function(id){
        return _organizationAuthorizationService.customDELETE(id);
    }

    return service;
}]);
