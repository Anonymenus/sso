/**
 *
 */
'use strict';

angular.module('MainApp', [])
    .controller('organizationMenuTreeCtrl', ['$rootScope','$scope', '$stateParams','$window','$state','i18nService', '$loading','sweet','organizationMenuTreeService',function($rootScope,$scope,$stateParams,$window, $state, i18nService,$loading,sweet,organizationMenuTreeService) {

        /*  变量初始化区域  start */
        //分页变量//


        $scope.loading = true;

        $scope.appId = $stateParams.appId;
        $scope.organizationId = $stateParams.organizationId;

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
            // $scope.generateZnodes_menu(data, $scope.menuIds);
            $scope.zTree_menu = $.fn.zTree.init($("#ztree"), $scope.zTreeSetting_menu, nodes);
            $scope.zTree_menu.expandAll(true); // 默认展开tree
        }


        $scope.generateZnodes_menu = function(menuTreeNodes, initCheckStr) {
            $.each(menuTreeNodes, function(i,treeNode){
                if (treeNode.children){
                    $scope.generateZnodes_menu(treeNode.children, initCheckStr);
                }
                $scope.treeNodeList.push(treeNode.data);
            });
        };


        $scope.getOrganizationMenuTree= function(appId,organizationId) {
            organizationMenuTreeService.getOrganizationMenuTree(appId,organizationId).then(function(data){
                var treeNodes = new Array()
                treeNodes.push(data.tree);
                $scope.loadres(treeNodes);
            }).finally(function () {
                $loading.finish("loadingTree");
            })
        };


        $scope.getOrganizationMenuTree($scope.appId,$scope.organizationId);

        organizationMenuTreeService.getApplication($scope.appId).then(function(app) {
            $scope.application = app;

        });
        organizationMenuTreeService.getOrganization($scope.organizationId).then(function(org) {
            $scope.organization = org;
        });

        $scope.assignOrganizationMenu = function(){
            var checkedNodes = $scope.zTree_menu.getCheckedNodes(true);
            var nodeIdArray = new Array();
            if (checkedNodes &&  checkedNodes.length > 0) {
                for (var i = 0; i < checkedNodes.length; i++) {
                    var id = checkedNodes[i].id;
                    var idArray = id.split("_");
                    var type = idArray[0];
                    if (type == 'M'){
                        nodeIdArray.push(idArray[1]);
                    }
                }

            }
            var assignedMenuIds = nodeIdArray.join(",");
            organizationMenuTreeService.assignOrganizationMenu($scope.appId,$scope.organizationId,assignedMenuIds).then(function(org) {
                $scope.getOrganizationMenuTree($scope.appId,$scope.organizationId);
            });

        }

        $scope.goList = function(){
            $state.go('sso.organization.authorization', {"id": $scope.organizationId});
        }


    }]).factory('organizationMenuTreeService', ['baseRestService',function (baseRestService) {

        var service = {};
        var _organizationMenuService = baseRestService.all('organization-menu');
        var _applicationService = baseRestService.all('application');

        var _organizationEditService = baseRestService.all('organization');
        
        service.getOrganization = function(id){
            return _organizationEditService.get(id);
        }

        service.getOrganizationMenuTree = function (appId,organizationId) {
            return _organizationMenuService.get('tree/app/'+appId+'/org/'+organizationId,{});
        }

        service.getApplication = function(appId){
            return _applicationService.get(appId);
        }
    
        service.assignOrganizationMenu = function (appId,organizationId,assignedMenuIds) {
            return _organizationMenuService.customPUT({assignedMenuIds: assignedMenuIds}, 'assign-menu/app/' + appId + '/org/'+organizationId, {})
            
        }




        return service;

    }]);