'use strict';

angular.module('MainApp', [])
    .controller('tableCtrl', ['$scope', 'i18nService', '$loading',function($scope, i18nService,$loading) {
        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        //产品列表数据载入方法//
        /*  $scope.onSelectPage = function(page, pageSize) {
         productService.getProducts(page, pageSize, $scope.pid, $scope.index, $scope.type, $scope.online, $scope.alarm, $scope.regeocode).
         then(function(result) {
         $scope.products = result;
         $scope.totalpage = result.totalpage;
         $scope.totalItems = result.totalitems;
         $scope.numPages = result.totalpage;
         $scope.currentPage = page;

         }).finally(function() {
         $scope.loading = false;
         })
         }

          //执行//
         $scope.onSelectPage(1, $scope.pageSize);*/

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
                {field: 'title', displayName: '产品名称', enableSorting: false, enableColumnMenu: false},
                {field: 'id', displayName: '产品ID'},
                {field: 'regin', displayName: '地址', enableSorting: false, enableColumnMenu: false},
                {field: 'status', displayName: '设备状态', enableSorting: false, enableColumnMenu: false}, {
                    field: 'caozuo',
                    displayName: '操作',
                    width: 400,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.showEdit(row)"><i class="fa fa-edit"></i>修改</button>' +
                    '<button class="btn btn-infos" ng-if="grid.appScope.user_name == \'lngiot@manager\'" ng-disabled="grid.appScope.user_name != \'admin\' || row.entity.status != \'未绑定\'" ng-click="grid.appScope.showBound(row)"><i class="fa fa-unlink"></i>绑定设备</button>' +
                    '<button class="btn btn-dangers" ng-click="grid.appScope.showAlarm(row)"><i class="fa fa-bell"></i>报警设置</button>' +
                    '<button class="btn btn-dangers" ng-if="row.entity.pushMessage" ng-click="grid.appScope.unPushMessage(row)"><i class="fa fa-pause"></i>暂停推送</button>' +
                    '<button class="btn btn-successs" ng-if="!row.entity.pushMessage" ng-click="grid.appScope.onPushMessage(row)"><i class="fa fa-play"></i>开启推送</button>' +
                    '<button class="btn btn-infos" ng-if="row.entity.type == \'gas\'" ng-click="grid.appScope.multipleTankSpecificationsDetail(row.entity.id,row.entity.type)"> <i class="fa fa-cogs"></i>规格设置</button>'
                }

            ],
            data: 'products' //数据
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


    }])
