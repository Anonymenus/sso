/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('resourceCtrl', ['$scope', '$state', 'i18nService', '$loading', 'sweet', 'resourceService', function($scope, $state, i18nService, $loading, sweet, resourceService) {

        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.resources = [];
        $scope.name = '';

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');


        //载入数据
        $scope.onSelectPage = function(page) {
            resourceService.getPages(page, $scope.pageSize, $scope.name).then(function(result) {
                $scope.resources = result.records;
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
                    displayName: '资源名',
                    width: 100,
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'code',
                    displayName: '资源码',
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'url',
                    displayName: 'url',
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'description',
                    displayName: '描述',
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'caozuo',
                    displayName: '操作',
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.edit(row)"><i class="fa fa-edit"></i>修改</button>'
                }

            ],
            data: 'resources' //数据
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

        $scope.add = function() {
            $state.go('sso.resource.add');
        }

        $scope.edit = function(row) {
            var id = row.entity.id;
            $state.go('sso.resource.edit', {
                'id': id
            });
        }


    }])
    .factory('resourceService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _resourceService = baseRestService.all('resource');

        service.getPages = function(page, pageSize, name) {
            return _resourceService.get('page', {
                'page': page,
                'pageSize': pageSize,
                'name': name
            });
        }

        return service;

    }]);