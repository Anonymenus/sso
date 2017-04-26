/**
 *
 */
'use strict';

angular.module('MainApp', [])
    .controller('menuCtrl', ['$rootScope','$scope', '$window','$state','i18nService', '$loading','sweet','menuService',function($rootScope,$scope,$window, $state, i18nService,$loading,sweet,menuService) {

        /*  变量初始化区域  start */
        //分页变量//
        $scope.currentPage = 1;
        $scope.numPages = 0;
        $scope.pageSize = 20;
        $scope.pages = [];

        $scope.gridApi = {};
        $scope.loading = true;

        $scope.totalItems = 0;

        $scope.menus = [];

        $scope.loginName = "";

        //ui-grid 中文化//
        i18nService.setCurrentLang('zh-cn');

        $rootScope.app.useFullLayout = true;


        //******************* ztree start *******************//
        $scope.treeNodeList = new Array();
        $scope.currentSelectedNode = new Object();
        //设置左侧Tree 高度
        $scope.TreeHeight = $window.innerHeight - 90;
        //监听浏览器缩放
        angular.element($window).bind('resize', function () {
            $scope.TreeHeight = $window.innerHeight - 90;
        });
        $scope.zTree_menu = new Object();
        $scope.zTreeSetting_menu = {
            check: {
                enable: true,
                chkboxType: {
                    "Y": "ps",
                    "N": "ps"
                }
            },
            view: {
                showIcon: false
            },
            callback: {
                onCheck: zTreeOnCheck_menu,
                onClick: zTreeOnClick
            }
        };


        function zTreeOnClick(event, treeId, treeNode) {
            $scope.zTree_menu.checkNode(treeNode, !treeNode.checked, true);
            $scope.currentSelectedNode = treeNode;
            var currentSelectedNodeId = $scope.currentSelectedNode.id;
            var currentSelectedNodeIdArray = currentSelectedNodeId.split("_");
            var type = currentSelectedNodeIdArray[0];
            var currentSelectedNode = $scope.getCurrentSelectedNode(currentSelectedNodeId);
            var appId = '';
            var parentId = '';
            if (type == "A") {
                // 选中的是应用节点
                if (currentSelectedNode.parentId > 0 && currentSelectedNode.appType != null  && currentSelectedNode.appType.length >0){
                    appId= currentSelectedNodeIdArray[1];
                }
            }else{
                parentId = currentSelectedNodeIdArray[1];
            }
            $scope.onSelectPage(1, appId, parentId);
            var nodes = $scope.zTree_menu.getCheckedNodes(true);
            $scope.menuIds = "";
            if (nodes && nodes.length && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    $scope.menuIds = $scope.menuIds + "_" + nodes[i].id + ",";
                }
                if(  $scope.menuIds.indexOf(",") > -1){
                    $scope.menuIds =   $scope.menuIds.substr(0,$scope.menuIds.length - 1);
                    //alert($scope.menuIds);
                }
            }
        }

        //选中后加入字符串
        function zTreeOnCheck_menu(event, treeId, treeNode) {
            var nodes = $scope.zTree_menu.getCheckedNodes(true);
            $scope.menuIds = "";
            if (nodes && nodes.length && nodes.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    $scope.menuIds = $scope.menuIds + "_" + nodes[i].id + ",";
                }
                if(  $scope.menuIds.indexOf(",") > -1){
                    $scope.menuIds =   $scope.menuIds.substr(0,$scope.menuIds.length - 1);
                }
            }
        }


        $scope.loadres = function(data){
            var nodes =  data;
            $scope.generateZnodes_menu(data, $scope.menuIds);
            console.log($scope.treeNodeList.length);
            $scope.zTree_menu = $.fn.zTree.init($("#ztree"), $scope.zTreeSetting_menu, nodes);
            $scope.zTree_menu.expandAll(true); // 默认展开tree
        }


        $scope.generateZnodes_menu = function(menuTreeNodes, initCheckStr) {
            $.each(menuTreeNodes, function(i,treeNode){
                if (treeNode.children){
                    $scope.generateZnodes_menu(treeNode.children, initCheckStr);
                }
                $scope.treeNodeList.push(treeNode.data);
                // if (initCheckStr && initCheckStr.indexOf("_" + menuJson[i].data.id + ",") >= 0) checked = true;

            });
            
           
        };


        $scope.getMenuTree= function() {
            menuService.getMenuTree().then(function(data){
                var treeNodes = new Array()
                treeNodes.push(data.tree);
                $scope.loadres(treeNodes);
            }).finally(function () {
                $loading.finish("loadingTree");
                $loading.finish('loading')
            })
        };


        $scope.getMenuTree();


        //载入数据
        $scope.onSelectPage = function (page,appId,parentId) {
            if ($.isEmptyObject(appId) && $.isEmptyObject(parentId)){
                return;
            }

            menuService.getMenuPage(page,$scope.pageSize,appId,parentId).then(function(result){
                $scope.menus = result.records;
                $scope.totalpage = result.totalpage;
                $scope.totalItems = result.totalElements;
                $scope.numPages = result.totalpage;
                $scope.currentPage = page;

            }).finally(function () {
                $loading.finish('loading')
            })
        }


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
                {field: 'name', displayName: '菜单名称',enableSorting: false, enableColumnMenu: false},
                {field: 'url', displayName: '菜单地址',enableSorting: false,enableColumnMenu: false},
                {field: 'menuCategory', displayName: '菜单类别',enableSorting: false,enableColumnMenu: false},
                {field: 'menuTypeText', displayName: '菜单类型',enableSorting: false,enableColumnMenu: false},
                {
                    field: 'caozuo',
                    displayName: '操作',
                    width:200,
                    enableSorting: false,
                    enableColumnMenu: false,
                    cellTemplate: '<button class="btn btn-infos" ng-click="grid.appScope.editMenu(row)"><i class="fa fa-edit"></i>修改</button>'+
                    '<button class="btn btn-infos" ng-click="grid.appScope.menuModule(row)"><i class="fa fa-edit"></i>模块管理</button>'
                }

            ],
            data: 'menus' //数据
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

        $scope.getCurrentSelectedNode = function (currentSelectedNodeId) {
            var currentSelectedNode = '';
            $.each($scope.treeNodeList, function(i,treeNode){
                if (treeNode.treeId == currentSelectedNodeId){
                    currentSelectedNode = treeNode;
                    return false;
                }
            });
            return currentSelectedNode;
        }

        $scope.editMenu = function(row){
            var id = row.entity.id;
            $state.go('sso.menu.edit', {
                'id': id
            });
        }

        $scope.menuModule = function(row){
            var id = row.entity.id;
            $state.go('sso.menu.functionModule', {
                'menuId': id
            });
        }

        $scope.add = function(){
            var currentSelectedNodeId = $scope.currentSelectedNode.id;
            var currentSelectedNode = '';
            if (currentSelectedNodeId == null || currentSelectedNodeId.length == 0){
                sweet.show('提示', '未选择菜单树父节点');
                return;
            }
            $.each($scope.treeNodeList, function(i,treeNode){
                if (treeNode.treeId == currentSelectedNodeId){
                    currentSelectedNode = treeNode;
                    return false;
                }
            });
            var currentSelectedNodeIdArray = currentSelectedNodeId.split("_");
            var type = currentSelectedNodeIdArray[0];
            var appId = '';
            var pid = '';
            if (type == "A"){
                // 选中的是应用节点
                if (currentSelectedNode.parentId =='-99' || currentSelectedNode.appType == null  || currentSelectedNode.appType == ""){
                    sweet.show('提示', '请选择菜单树上的子应用节点');
                    return;
                }
                appId= currentSelectedNodeIdArray[1];
                pid = '-3';
            }else{
                //选中的是菜单节点
                appId = currentSelectedNode.appId;
                pid = currentSelectedNode.id;

            }
            $state.go('sso.menu.add',{"appId":appId,"pid":pid});
        }

        $scope.edit = function(row){
            var id = row.entity.id;
            $state.go('sso.application.parentEdit',{'id':id});
        }

        


    }]).factory('menuService', ['baseRestService',function (baseRestService) {

        var service = {};

        var _menuService = baseRestService.all('menu');

        service.getMenuTree = function () {
            return _menuService.get('all-tree',{});
        }


        service.getMenuPage = function(page, pageSize,appId,parentId){
            return _menuService.get('page',{
                'page':page,
                'pageSize':pageSize,
                'appId':appId,
                'parentId':parentId
            });
        }

        return service;

    }]);