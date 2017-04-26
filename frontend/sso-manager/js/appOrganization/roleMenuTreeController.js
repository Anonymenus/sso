/**
 *
 */
'use strict';

angular.module('MainApp', [])
    .controller('roleMenuTreeCtrl', ['$rootScope','$scope', '$stateParams','$window','$state','i18nService', '$loading','sweet','organizationMenuTreeService',function($rootScope,$scope,$stateParams,$window, $state, i18nService,$loading,sweet,roleMenuTreeService) {

        $scope.loading = true;
        $scope.roleId = $stateParams.roleId;
        $scope.appId = $stateParams.appId;
        $scope.organizationRole = new Object();




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


        $scope.getRoleMenuTree= function() {
            roleMenuTreeService.getRoleMenuTree($scope.roleId,$scope.appId).then(function(data){
                var treeNodes = new Array()
                treeNodes.push(data.tree);
                $scope.loadres(treeNodes);
            }).finally(function () {
                $loading.finish("loadingTree");
            })
        };




        $scope.initLoadData = function(){
            roleMenuTreeService.getOrganizationRole($scope.roleId).then(function (organizationRole) {
                $scope.organizationRole = organizationRole;
                $scope.organizationId = organizationRole.organizationId;
                $scope.getRoleMenuTree();
            });

        }
        $scope.initLoadData();

        $scope.assignRoleMenu = function(){
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
            roleMenuTreeService.assignRoleMenu($scope.roleId,assignedMenuIds,$scope.appId).then(function(org) {
                $scope.getRoleMenuTree();
            });

        }

       

        $scope.goList = function () {
            $state.go('sso.organization.role',{'id':$scope.authId,'orgId':$scope.organizationId});
        }


    }]).factory('organizationMenuTreeService', ['baseRestService',function (baseRestService) {

        var service = {};
        var _roleMenuService = baseRestService.all('role-menu');
        var _applicationService = baseRestService.all('application');

        var _organizationEditService = baseRestService.all('organization');

        var _organizationRoleService = baseRestService.all('organization-role');

        service.getOrganizationRole = function (id) {
            return _organizationRoleService.get(id);
        }
        
        service.getOrganization = function(id){
            return _organizationEditService.get(id);
        }



        service.getApplication = function(appId){
            return _applicationService.get(appId);
        }

        service.getRoleMenuTree = function (roleId,appId) {
            return _roleMenuService.get('tree/'+roleId+'/app/'+appId,{});
        }


        service.assignRoleMenu = function (roleId,assignedMenuIds,appId) {
            return _roleMenuService.customPUT({assignedMenuIds: assignedMenuIds, appId: appId}, 'assign-menu/' + roleId, {})
        }




        return service;

    }]);