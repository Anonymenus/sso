/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:44
 *
 */
'use strict';

/*angular.module('fullstackApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('blogList', {
        url: '/blogList',
        templateUrl: 'app/admin/blogList/blogList.html',
        controller: 'BlogListCtrl',
        authenticate:true
      })
      .state('blogWrite', {
        url: '/blog_write',
        templateUrl: 'app/admin/blogList/blog_write.html',
        controller: 'BlogWriteCtrl',
        authenticate:true
      })
  });*/


angular.module('MainApp').config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
        //去掉 '#'
        // $locationProvider.html5Mode(true);
        $urlRouterProvider.otherwise('sso/form');
        $stateProvider
            .state('login', {
                url: '/login',
                title: '登录名',
                templateUrl: 'views/tplLogin/tpl_login.html',
                controller: 'loginCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load([]).then(
                                function() {
                                    return $ocLazyLoad.load(['js/appLogin/loginController.js' + '?v=' + version]);
                                }
                            );
                        }
                    ]
                }
            })
            .state('sso', {
                url: '/sso',
                abstract: true,
                templateUrl: 'views/app.html'
            })
            .state('sso.form', {
                url: '/form',
                title: '表单',
                templateUrl: 'views/tplHome/tpl_home.html'
            })
            .state('sso.table', {
                url: '/table',
                title: '表单',
                templateUrl: 'views/tplHome/tpl_table.html',
                controller: 'tableCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['ngGrid']).then(
                                function() {
                                    return $ocLazyLoad.load(['js/appDemo/tableCtrl.js' + '?v=' + version]);
                                }
                            );
                        }
                    ]
                }
            })

        .state('sso.tree', {
                url: '/tree',
                title: '树',
                templateUrl: 'views/tplHome/tpl_tree.html',
                controller: 'treeCtrl',
                resolve: {
                    deps: ['$ocLazyLoad',
                        function($ocLazyLoad) {
                            return $ocLazyLoad.load(['tree']).then(
                                function() {
                                    return $ocLazyLoad.load(['js/appDemo/treeCtrl.js' + '?v=' + version]);
                                }
                            );
                        }
                    ]
                }
            })
            .state('sso.layout', {
                url: '/layout',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '布局',
                    'content@sso.layout': {
                        templateUrl: 'views/tplHome/tpl_layout.html'
                    }
                }
            })
            .state('sso.layout.css', {
                url: '/css',
                views: {
                    title: '布局',
                    'content@sso.layout': {
                        templateUrl: 'views/tplHome/tpl_tree.html'
                    }
                }
            })
            //后台用户管理
            .state('sso.managerAccount', {
                url: '/managerAccount',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '后台用户管理',
                    'content@sso.managerAccount': {
                        templateUrl: 'views/tplManager/tpl_manager_account.html',
                        controller: 'managerAccountCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appManager/managerAccountController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //新增后台用户管理
            .state('sso.managerAccount.add', {
                url: '/add',
                views: {
                    title: '新增',
                    'content@sso.managerAccount': {
                        templateUrl: 'views/tplManager/tpl_manager_account_add.html',
                        controller: 'managerAccountAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appManager/managerAccountAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //修改后台用户管理
            .state('sso.managerAccount.edit', {
                url: '/edit/:id',
                views: {
                    title: '修改',
                    'content@sso.managerAccount': {
                        templateUrl: 'views/tplManager/tpl_manager_account_edit.html',
                        controller: 'managerAccountEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appManager/managerAccountEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })

        //机构
        .state('sso.organization', {
                url: '/organization',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '机构',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization.html',
                        controller: 'organizationCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--新增
            .state('sso.organization.add', {
                url: '/add',
                views: {
                    title: '机构新增',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_add.html',
                        controller: 'organizationAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--修改
            .state('sso.organization.edit', {
                url: '/edit/:id',
                views: {
                    title: '机构修改',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_edit.html',
                        controller: 'organizationEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--应用授权列表
            .state('sso.organization.authorization', {
                url: '/authorization/:id',
                views: {
                    title: '机构修改',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_authorization.html',
                        controller: 'organizationAuthorizationCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationAuthorizationController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--应用授权列表
            .state('sso.organization.authAdd', {
                url: '/authAdd/:id',
                views: {
                    title: '新增授权',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_authorization_add.html',
                        controller: 'organizationAuthorizationAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationAuthorizationAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--角色列表
            .state('sso.organization.role', {
                url: '/role/:appId/:orgId',
                views: {
                    title: '机构角色',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_role.html',
                        controller: 'organizationRoleCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationRoleController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--角色列表
            .state('sso.organization.roleAdd', {
                url: '/roleAdd/:id/:orgId',
                views: {
                    title: '新增角色',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_role_add.html',
                        controller: 'organizationRoleAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationRoleAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构--角色列表
            .state('sso.organization.roleEdit', {
                url: '/roleEdit/:id/:authId/:orgId',
                views: {
                    title: '新增角色',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_role_edit.html',
                        controller: 'organizationRoleEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationRoleEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            .state('sso.organization.organizationMenuTree', {
                url: '/organizationMenu/:appId/:organizationId',
                views: {

                    title: '企业菜单',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_organization_menu_tree.html',
                        controller: 'organizationMenuTreeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/organizationMenuTreeController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            .state('sso.organization.roleMenuTree', {
                url: '/roleMenuTree/:roleId/:appId',
                views: {
                    title: '角色菜单',
                    'content@sso.organization': {
                        templateUrl: 'views/tplOrganization/tpl_role_menu_tree.html',
                        controller: 'roleMenuTreeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appOrganization/roleMenuTreeController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //后台用户管理
            .state('sso.application', {
                url: '/application',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '应用管理',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_application_parent.html',
                        controller: 'applicationCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/applicationController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //新增父级的应用
            .state('sso.application.parentAdd', {
                url: '/parentAdd',
                views: {
                    title: '新增',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_application_parent_add.html',
                        controller: 'applicationParentAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/applicationParentAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //修改父级的应用
            .state('sso.application.parentEdit', {
                url: '/parentEdit/:id',
                views: {
                    title: '修改',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_application_parent_edit.html',
                        controller: 'applicationParentEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/applicationParentEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //子应用的应用
            .state('sso.application.child', {
                url: '/child/:id',
                views: {
                    title: '子应用',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_application_child.html',
                        controller: 'applicationChildCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/applicationChildController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //新增子级的应用
            .state('sso.application.childAdd', {
                url: '/childAdd/:id',
                views: {
                    title: '新增',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_application_child_add.html',
                        controller: 'applicationChildAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/applicationChildAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //修改子级的应用
            .state('sso.application.childEdit', {
                url: '/childEdit/:id/:parentId',
                views: {
                    title: '修改',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_application_child_edit.html',
                        controller: 'applicationChildEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/applicationChildEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构类型
            .state('sso.application.orgType', {
                url: '/orgType/:id',
                views: {
                    title: '机构类型',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_organization_type.html',
                        controller: 'applicationOrgTypeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/organizationTypeController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构类型--新增
            .state('sso.application.orgTypeAdd', {
                url: '/orgTypeAdd/:id',
                views: {
                    title: '新增机构类型',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_organization_type_add.html',
                        controller: 'applicationOrgTypeAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/organizationTypeAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //机构类型--修改
            .state('sso.application.orgTypeEdit', {
                url: '/orgTypeEdit/:id/:appId',
                views: {
                    title: '机构类型修改',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_organization_type_edit.html',
                        controller: 'applicationOrgTypeEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/organizationTypeEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })

            //功能模块
            .state('sso.application.functionModule', {
                url: '/functionModule/:appId/:parentId',
                views: {
                    title: '功能模块列表',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_function_module.html',
                        controller: 'functionModuleCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/functionModuleController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })

            //功能模块
            .state('sso.application.functionModuleAdd', {
                url: '/functionModuleAdd/:appId/:parentId',
                views: {
                    title: '新增功能模块',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_function_module_add.html',
                        controller: 'functionModuleAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/functionModuleAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })

            //修改
            .state('sso.application.functionModuleEdit', {
                url: '/functionModuleEdit/:id/:appId/:parentId',
                views: {
                    title: '修改功能模块',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_function_module_edit.html',
                        controller: 'functionModuleEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/functionModuleEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })

            //后台资源管理
            .state('sso.application.resource', {
                    url: '/resource/:appId/:parentId',
                    views: {
                    title: '后台资源管理',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_resource.html',
                        controller: 'resourceCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/resourceController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //新增资源
            .state('sso.application.resourceAdd', {
                url: '/resourceAdd/:appId/:parentId',
                views: {
                    title: '新增',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_resource_add.html',
                        controller: 'resourceAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/resourceAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //修改资源
            .state('sso.application.resourceEdit', {
                url: '/resourceEdit/:id/:appId/:parentId',
                views: {
                    title: '修改',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_resource_edit.html',
                        controller: 'resourceEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/resourceEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //修改资源
            .state('sso.application.functionResource', {
                url: '/functionResource/:functionId/:appId/:parentId',
                views: {
                    title: '修改',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_function_resource.html',
                        controller: 'functionResourceCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/functionResourceController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //新增关系
            .state('sso.application.functionResourceAdd', {
                url: '/functionResourceAdd/:functionId/:appId/:parentId',
                views: {
                    title: '修改',
                    'content@sso.application': {
                        templateUrl: 'views/tplApplication/tpl_function_resource_add.html',
                        controller: 'functionResourceAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appApplication/functionResourceAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //后台角色管理
            .state('sso.role', {
                url: '/role',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '后台角色管理',
                    'content@sso.role': {
                        templateUrl: 'views/tplRole/tpl_role.html',
                        controller: 'roleCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appRole/roleController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //新增角色
            .state('sso.role.add', {
                url: '/add',
                views: {
                    title: '新增',
                    'content@sso.role': {
                        templateUrl: 'views/tplRole/tpl_role_add.html',
                        controller: 'roleAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appRole/roleAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //修改角色
            .state('sso.role.edit', {
                url: '/edit/:id',
                views: {
                    title: '修改',
                    'content@sso.role': {
                        templateUrl: 'views/tplRole/tpl_role_edit.html',
                        controller: 'roleEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appRole/roleEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            //菜单管理
            .state('sso.menu', {
                url: '/menu',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '菜单管理',
                    'content@sso.menu': {
                        templateUrl: 'views/tplMenu/tpl_menu.html',
                        controller: 'menuCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appMenu/menuController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            .state('sso.menu.add', {
                url: '/add/:appId/:pid',
                views: {
                    title: '菜单新增',
                    'content@sso.menu': {
                        templateUrl: 'views/tplMenu/tpl_menu_add.html',
                        controller: 'menuAddCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appMenu/menuAddController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            .state('sso.menu.edit', {
                url: '/edit/:id',
                views: {
                    title: '菜单修改',
                    'content@sso.menu': {
                        templateUrl: 'views/tplMenu/tpl_menu_edit.html',
                        controller: 'menuEditCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appMenu/menuEditController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            .state('sso.menu.functionModule', {
                url: '/functionModule/:menuId',
                views: {
                    title: '菜单功能模块',
                    'content@sso.menu': {
                        templateUrl: 'views/tplMenu/tpl_menu_function_module.html',
                        controller: 'menuModuleCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appMenu/menuModuleController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            .state('sso.menu.functionModuleBind', {
                url: '/functionModuleBind/:menuId',
                views: {
                    title: '菜单功能模块',
                    'content@sso.menu': {
                        templateUrl: 'views/tplMenu/tpl_menu_function_module_bind.html',
                        controller: 'menuModuleBindCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load([]).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appMenu/menuModuleBindController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })

            // 账号
            .state('sso.account', {
                url: '/account',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '账号',
                    'content@sso.account': {
                        templateUrl: 'views/tplAccount/tpl_account.html',
                        controller: 'accountCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appAccount/accountController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            // 账户修改
            .state('sso.account.edit', {
                url: '/edit/:id',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '账户修改',
                    'content@sso.account': {
                        templateUrl: 'views/tplAccount/tpl_account_modify.html',
                        controller: 'accountModifyCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['tree', 'ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appAccount/accountModifyController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            // 员工
            .state('sso.employee', {
                url: '/employee',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '员工',
                    'content@sso.employee': {
                        templateUrl: 'views/tplAccount/tpl_employee.html',
                        controller: 'employeeCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appAccount/employeeController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            // 员工 -- 新增
            .state('sso.employee.add', {
                url: '/add',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '新增员工',
                    'content@sso.employee': {
                        templateUrl: 'views/tplAccount/tpl_employee_modify.html',
                        controller: 'employeeModifyCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appAccount/employeeModifyController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })
            // 员工 -- 修改
            .state('sso.employee.edit', {
                url: '/edit/:id',
                views: {
                    '': {
                        templateUrl: 'views/content.html'
                    },
                    title: '员工修改',
                    'content@sso.employee': {
                        templateUrl: 'views/tplAccount/tpl_employee_modify.html',
                        controller: 'employeeModifyCtrl',
                        resolve: {
                            deps: ['$ocLazyLoad',
                                function($ocLazyLoad) {
                                    return $ocLazyLoad.load(['ngGrid']).then(
                                        function() {
                                            return $ocLazyLoad.load(['js/appAccount/employeeModifyController.js' + '?v=' + version]);
                                        }
                                    );
                                }
                            ]
                        }
                    }
                }
            })




        //http拦截器
        $httpProvider.interceptors.push('interceptor');

    }
]);
