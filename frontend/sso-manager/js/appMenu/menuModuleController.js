/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.functionModule', [])
    .controller('menuModuleCtrl', ['$scope', '$stateParams','$state', 'i18nService', '$loading', 'sweet', 'menuModuleService', function($scope, $stateParams,$state, i18nService, $loading, sweet, menuModuleService) {

        $scope.menuId = $stateParams.menuId;


        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.functionModules = [];
        $scope.code = '';
        $scope.name = '';

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');


        //载入数据
        $scope.onSelectPage = function(page) {
            menuModuleService.getPages(page, $scope.pageSize,$scope.menuId).then(function(result) {
                $scope.functionModules = result.records;
                $scope.totalpage = result.totalpage;
                $scope.totalItems = result.totalElements;
                $scope.numPages = result.totalpage;
                $scope.currentPage = page;

            }).finally(function() {
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
            columnDefs: [{
                    field: 'name',
                    displayName: '模块名称',
                    enableSorting: false,
                    enableColumnMenu: false
                },{
                    field: 'code',
                    displayName: '模块编码',
                    enableSorting: false,
                    enableColumnMenu: false

                },
                {field: 'createTime', displayName: '创建日期',cellFilter: 'toDateTime', enableSorting: false, enableColumnMenu: false},{
                    field: 'caozuo',
                    displayName: '操作',
                    enableSorting: false,
                    enableColumnMenu: false,

                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.unbindMenu(row)"><i class="fa fa-edit"></i>解绑</button>'
                }

            ],
            data: 'functionModules' //数据
        };

        /**
         * 2.配置gridApi
         * @param gridApi
         */
        $scope.gridOptions.onRegisterApi = function(gridApi) {
            $scope.gridApi = gridApi;
            gridApi.pagination.on.paginationChanged($scope, function(pageNumber, pageSize) {
                $scope.onSelectPage(pageNumber, pageSize);
            });
        };
        /**
         * 3.watch totalItems的变化,然后赋值给ui-grid的数据总条数
         */
        $scope.$watch('totalItems', function(value) {
            if (value != undefined) {
                $scope.gridApi.grid.options.totalItems = value;
            }
        });

        $scope.menuModuleBind = function(){
            $state.go('sso.menu.functionModuleBind',{'menuId':$scope.menuId});
        }

        $scope.unbindMenu = function(row){
            menuModuleService.unbindMenu($scope.menuId, row.entity.id).then(function (result) {
                $scope.onSelectPage($scope.page);
            });
        }

        $scope.goList = function(){
            $state.go('sso.application.child',{'id':$scope.parentId});
        }


    }])
    .factory('menuModuleService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _functionModuleService = baseRestService.all('function-module');

        service.getPages = function(page, pageSize,menuId) {
            return _functionModuleService.get('page', {
                'page': page,
                'pageSize': pageSize,
                'menuId':menuId
            });
        }

        service.unbindMenu = function(menuId,moduleId){
            return _functionModuleService.customDELETE('unbind/menu/'+menuId+'/module/'+moduleId, null, {});

        }

        return service;

    }]);