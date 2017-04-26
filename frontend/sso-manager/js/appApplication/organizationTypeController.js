/**
 * Created by sunshun on 2016/10/24.
 */

'use strict';

angular.module('MainApp.applicationOrgType', [])
    .controller('applicationOrgTypeCtrl', ['$scope', '$stateParams','i18nService', '$loading','sweet','applicationOrgTypeService', '$state', function($scope,$stateParams, i18nService, $loading,sweet,applicationOrgTypeService, $state) {

        $scope.appId = $stateParams.id;
        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.types = [];

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        if($scope.appId == null || $scope.appId == '' || $scope.appId == undefined){
            $state.go('sso.application');
        }

        //载入数据
        $scope.onSelectPage = function (page) {
            applicationOrgTypeService.getPages(page,$scope.pageSize,$scope.name,$scope.appId).then(function(result){
                $scope.types = result.records;
                $scope.totalpage = result.totalpage;
                $scope.totalItems = result.totalElements;
                $scope.numPages = result.totalpage;
                $scope.currentPage = page;

            }).finally(function () {
                $loading.finish('loading')
            })
        }

        $scope.onSelectPage($scope.page);


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
                {field: 'code', displayName: '机构编号', enableSorting: false, enableColumnMenu: false},
                {field: 'name', displayName: '机构名称', enableSorting: false, enableColumnMenu: false},
                {field: 'appKey', displayName: '应用key', enableSorting: false, enableColumnMenu: false},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    width: 400,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.showEdit(row)"><i class="fa fa-edit"></i>修改</button>' +
                    '<button class="btn btn-infos" ng-click="grid.appScope.showDelete(row)"><i class="fa fa-remove"></i>删除</button>'
                }

            ],
            data: 'types' //数据
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
        $scope.addType = function () {
            $state.go('sso.application.orgTypeAdd',{'id':$scope.appId});
        }
        /**
         * 修改
         */
        $scope.showEdit = function (row) {
            var id = row.entity.id;
            $state.go('sso.application.orgTypeEdit', {"id": id,"appId":$scope.appId});
        }

        $scope.goList = function(){
            $state.go('sso.application');
        }


    }]).factory('applicationOrgTypeService', ['baseRestService', function (baseRestService) {

    var service = {};

    var _applicationOrgTypeService = baseRestService.all('organization-type');

    service.getPages = function(page,pageSize,name,appId){
        return _applicationOrgTypeService.get('/page',{
            'page':page,
            'pageSize':pageSize,
            'appId':appId,
            'name':name
        });
    }

    return service;
}]);
