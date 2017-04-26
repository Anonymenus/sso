/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp.organizationRole', [])
    .controller('organizationRoleCtrl', ['$scope','sweet','$stateParams','i18nService', '$loading', 'organizationRoleService', '$state', function($scope,sweet,$stateParams,i18nService, $loading, organizationRoleService, $state) {

        $scope.appId = $stateParams.appId;

        $scope.organizationId = $stateParams.orgId;

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
        $scope.organizationRoles = [];

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        if(!$scope.appId||!$scope.organizationId ){
            $state.go('sso.organization');
        }

        //产品列表数据载入方法//
         $scope.onSelectPage = function(page) {
             organizationRoleService.getOrganizationRoles(page,$scope.pageSize,$scope.name,$scope.organizationId,$scope.appId).then(function(result) {
                 $scope.organizationRoles = result.records;
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
                {field: 'name', displayName: '角色名称', enableSorting: false, enableColumnMenu: false},
                {field: 'code', displayName: '角色CODE',enableSorting: false, enableColumnMenu: false},
                {field: 'createTime', displayName: '创建时间',enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    width: 400,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate:
                    '<button class="btn btn-infos" ng-click="grid.appScope.edit(row)"><i class="fa fa-edit"></i>修改</button>'+
                    '<button class="btn btn-infos" ng-click="grid.appScope.delete(row)"><i class="fa fa-delete"></i>删除</button>' +
                    '<button class="btn btn-infos" ng-click="grid.appScope.roleMenu(row)"><i class="fa fa-delete"></i>角色菜单</button>'
                }

            ],
            data: 'organizationRoles' //数据
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
            $state.go('sso.organization.roleAdd',{'id':$scope.authId,'orgId':$scope.orgId});
        }
        /**
         * 修改
         */
        $scope.edit = function (row) {
            $state.go('sso.organization.roleEdit', {"id": row.entity.id,'authId':$scope.authId,'orgId':$scope.orgId});
        }

        $scope.roleMenu = function (row) {
            $state.go('sso.organization.roleMenuTree', {"roleId": row.entity.id,'appId':$scope.appId});
        }

        $scope.goList = function(){
            $state.go('sso.organization.authorization', {"id": $scope.orgId});
        }




    }]).factory('organizationRoleService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _organizationRoleServiceService = baseRestService.all('organization-role');

    service.getOrganizationRoles = function(page, pageSize,name,organizationId,appId){
        return _organizationRoleServiceService.get('/page',
            {'page': page, 'pageSize': pageSize,'name':name,'organizationId':organizationId,'appId':appId});
    }

    return service;
}]);
