/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp', [])
    .controller('organizationCtrl', ['$scope', 'i18nService', '$loading', 'organizationService', '$state', function($scope, i18nService, $loading, organizationService, $state) {
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
        $scope.organizations = [];

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        //产品列表数据载入方法//
         $scope.onSelectPage = function(page) {
             organizationService.getOrganizationList(page,$scope.pageSize,$scope.name).then(function(result) {
                 $scope.organizations = result.records;
                 $scope.totalpage = result.totalpage;
                 $scope.totalItems = result.totalElements;
                 $scope.numPages = result.totalpage;
                 $scope.currentPage = page;

         }).finally(function() {
                 $loading.finish('loading')
            })
         }

         //执行//
         $scope.onSelectPage();

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
                {field: 'name', displayName: '机构名称', enableSorting: false, enableColumnMenu: false},
                {field: 'contactPerson', displayName: '联系人',enableSorting: false, enableColumnMenu: false},
                {field: 'contactMobile', displayName: '联系人手机', enableSorting: false, enableColumnMenu: false},
                {field: 'registerDate', displayName: '注册时间', enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                {field: 'createTime', displayName: '创建时间',enableSorting: false, enableColumnMenu: false, cellFilter: 'toDateTime'},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    width: 400,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate:
                    '<button class="btn btn-infos" ng-click="grid.appScope.showEdit(row)"><i class="fa fa-edit"></i>修改</button>'+
                    '<button class="btn btn-infos" ng-click="grid.appScope.auth(row)"><i class="fa fa-check"></i>应用授权</button>'
                }

            ],
            data: 'organizations' //数据
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
            $state.go('sso.organization.add');
        }
        /**
         * 修改
         */
        $scope.showEdit = function (row) {
            $state.go('sso.organization.edit', {"id": row.entity.id});
        }
        /**
         * 授权
         * @param row
         */
        $scope.auth = function(row){
            $state.go('sso.organization.authorization', {"id": row.entity.id});
        }


    }]).factory('organizationService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _organizationService = baseRestService.all('organization');

    service.getOrganizationList = function(page, pageSize,name){
        return _organizationService.get('/page',{'page': page, 'pageSize': pageSize,'name':name});
    }

    return service;
}]);
