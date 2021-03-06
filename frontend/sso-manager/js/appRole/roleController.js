/**
 * Created by Administrator on 2016/10/21 0021.
 */
'use strict';

angular.module('MainApp', [])
    .controller('roleCtrl', ['$scope', '$state', 'i18nService', '$loading', 'sweet', 'roleService', function($scope, $state, i18nService, $loading, sweet, roleService) {

        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.roles = [];
        $scope.name = '';

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');


        //载入数据
        $scope.onSelectPage = function(page) {
            roleService.getPages(page, $scope.pageSize, $scope.name).then(function(result) {
                $scope.roles = result.records;
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
                    displayName: '角色名称',
                    width: 150,
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'code',
                    displayName: '角色编码',
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'remark',
                    displayName: '备注',
                    enableSorting: false,
                    enableColumnMenu: false
                }, {
                    field: 'category',
                    displayName: '角色类别',
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
            data: 'roles' //数据
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
            $state.go('sso.role.add');
        }

        $scope.edit = function(row) {
            var id = row.entity.id;
            $state.go('sso.role.edit', {
                'id': id
            });
        }


    }])
    .factory('roleService', ['baseRestService', function(baseRestService) {

        var service = {};

        var _roleService = baseRestService.all('role');

        service.getPages = function(page, pageSize, name) {
            return _roleService.get('/page', {
                'page': page,
                'pageSize': pageSize,
                'name': name
            });
        }

        return service;

    }]);