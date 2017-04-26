/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp.functionResource', [])
    .controller('functionResourceCtrl', ['$scope', '$stateParams','$state', 'i18nService', '$loading', 'sweet', 'functionResourceService', function($scope, $stateParams,$state, i18nService, $loading, sweet, functionResourceService) {

        $scope.functionId = $stateParams.functionId;

        $scope.appId = $stateParams.appId;

        $scope.parentId = $stateParams.parentId;

        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.functionResources = [];
        $scope.code = '';
        $scope.name = '';

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');


        //载入数据
        $scope.onSelectPage = function(page) {
            functionResourceService.getPages(page, $scope.pageSize,$scope.functionId).then(function(result) {
                $scope.functionResources = result.records;
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
                    field: 'functionName',
                    displayName: '模块名称',
                    enableSorting: false,
                    enableColumnMenu: false

                },{
                    field: 'resourceName',
                    displayName: '资源名称',
                    enableSorting: false,
                    enableColumnMenu: false
                },{
                    field: 'resourceCode',
                    displayName: '资源编码',
                    enableSorting: false,
                    enableColumnMenu: false

                },{
                    field: 'resourceUrl',
                    displayName: '资源地址',
                    enableSorting: false,
                    enableColumnMenu: false

                },
                {field: 'createDate', displayName: '创建日期',cellFilter: 'toDateTime', enableSorting: false, enableColumnMenu: false},{
                    field: 'caozuo',
                    displayName: '操作',
                    enableSorting: false,
                    enableColumnMenu: false,

                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.delete(row)"><i class="fa fa-edit"></i>删除</button>'
                }

            ],
            data: 'functionResources' //数据
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

        $scope.add = function(){
            $state.go('sso.application.functionResourceAdd',{'functionId':$scope.functionId,'appId':$scope.appId,'parentId':$scope.parentId});
        }

        $scope.delete = function(row){


            sweet.show({
                title: '提醒',
                text: '删除后,模块不在拥有此权限!是否确定删除?',
                showCancelButton: true,
                closeOnConfirm: true,
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }, function() {

                functionResourceService.deleteFunctionResource(row.entity.id).then(function(res){
                    $scope.onSelectPage(1);
                })
            });


        }

        $scope.goList = function(){
            $state.go('sso.application.functionModule',{'appId':$scope.appId,'parentId':$scope.parentId});
        }


    }])
    .factory('functionResourceService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _functionResourceService = baseRestService.all('function-resource');

        service.getPages = function(page, pageSize,functionId) {
            return _functionResourceService.get('page', {
                'page': page,
                'pageSize': pageSize,
                'functionId':functionId
            });
        }

        service.getFunctionResource = function(id){
            return _functionResourceService.get(id);
        }

        service.deleteFunctionResource = function(id){
            return _functionResourceService.customDELETE(id);
        }

        return service;

    }]);