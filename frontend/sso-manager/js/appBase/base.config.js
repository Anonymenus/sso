/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:42
 *
 */

'use strict';

angular.module('MainApp')
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [{
                name: 'ngGrid',
                files: [
                    'js/lib/ui-grid.js',
                    'bower_components/angular-ui-grid/ui-grid.min.css',
                ]
            }, {
                name: 'ui.select',
                files: [
                    'lib/angular-ui-select/select.min.js',
                    'lib/angular-ui-select/select.css'
                ]
            }, {
                name: 'agGird',
                files: [
                    'bower_components/ag-grid/dist/ag-grid.js',
                    'bower_components/ag-grid/dist/ag-grid.min.css',
                    // 'bower_components/ag-grid/dist/theme-blue.min.css',
                    'bower_components/angular-ui-grid/ui-grid.min.css'
                ]
            }, {
                name: 'echarts',
                files: [
                    'js/common/echarts/echarts.min.js'
                ]
            }, {
                name: 'angularScreenfull',
                files: [
                    'bower_components/screenfull/dist/screenfull.js',
                    'js/lib/fullScreen/angular-screenfull.js'
                ]
            }, {
                name: 'angular-echarts',
                files: [
                    'js/lib/echarts/angular-echarts.min.js'
                ]
            }, {
                name: 'screenfull',
                files: [
                    'lib/screenfull/dist/screenfull.js'
                ]
            }, {
                name: 'tree',
                files: [
                    'js/common/zTree/V3/js/jquery.ztree.core-3.5.js',
                    'js/common/zTree/V3/js/jquery.ztree.excheck-3.5.js',
                    'js/common/zTree/V3/css/zTreeStyle/zTreeStyle.css'

                ]
            }, {
                name: 'region',
                files: [
                    'js/common/region/AreaData_min.js'

                ]
            },
                {
                    name: 'region2',
                    files: [
                        'js/common/region/Area.js',
                        'js/common/region/region.js',
                        'js/common/region/AreaData_min2.js'

                    ]
                },
                {
                    name: 'sweet',
                    files: [
                        'bower_components/sweetalert/dist/sweetalert.css',
                        'bower_components/sweetalert/dist/sweetalert.min.js',
                        'bower_components/angular-sweetalert/dist/ngSweetAlert.min.js'
                    ]
                }, {
                    name: 'perfectscroll',
                    files: [
                        'js/jquery/jquery.slimscroll.min.js'

                    ]
                }, {
                    name: 'datepick',
                    files: [
                        'js/common/My97DatePicker/WdatePicker.js',
                        'js/common/My97DatePicker/skin/WdatePicker.css'

                    ]
                }, {
                    name: 'pageslide',
                    files: [
                        'bower_components/angular-pageslide-directive/dist/angular-pageslide-directive.js'

                    ]
                }, {
                    name: 'selectModel',
                    files: [
                        'bower_components/selection-model/dist/selection-model.min.js'
                    ]
                }, {
                    name: 'uisort',
                    files: [
                        'bower_components/angular-ui-sortable/sortable.min.js'
                    ]
                }, {
                    name: 'ng-grid',
                    files: [
                        'bower_components/ng-grid/ng-grid-2.0.14.min.js',
                        'bower_components/ng-grid/ng-grid.min.css'
                    ]
                }, {
                    name: 'agTree',
                    files: [
                        'bower_components/angular-tree-control/angular-tree-control.js',
                        'bower_components/angular-tree-control/css/tree-control.css',
                        'bower_components/angular-tree-control/css/tree-control-attribute.css'
                    ]
                }, {
                    name: 'animateNum',
                    files: [
                        'bower_components/angular-timer/dist/angular-timer.min.js'
                    ]
                }, {
                    name: 'timeLine',
                    files: [
                        'js/lib/timeLine/angular-timeline.css',
                        'js/lib/timeLine/angular-timeline.js'
                    ]
                }, {
                    name: 'tree',
                    files: [
                        'bower_components/angular-ivh-treeview/dist/ivh-treeview.css',
                        'bower_components/angular-ivh-treeview/dist/ivh-treeview-theme-basic.css',
                        'bower_components/angular-ivh-treeview/dist/ivh-treeview.js'
                    ]
                }
            ]
        });
    }]);
mainApp.config(["w5cValidatorProvider", function (w5cValidatorProvider) {

    // 全局配置
    w5cValidatorProvider.config({
        blurTrig: false,
        showError: true,
        removeError: true
    });

    w5cValidatorProvider.setRules({
        email: {
            required: "输入的邮箱地址不能为空",
            email: "输入邮箱地址格式不正确"
        },
        username: {
            required: "输入的用户名不能为空",
            pattern: "用户名必须输入字母、数字、下划线,以字母开头",
            w5cuniquecheck: "输入用户名已经存在，请重新输入"
        },
        password: {
            required: "密码不能为空",
            minlength: "密码长度不能小于{minlength}",
            maxlength: "密码长度不能大于{maxlength}",
            pattern: "请输入6-12位数字或英文组合"
        },
        oldPassword: {
            required: "密码不能为空",
            minlength: "密码长度不能小于{minlength}",
            maxlength: "密码长度不能大于{maxlength}",
            pattern: "请输入6-12位数字或英文组合"
        },
        newPassword: {
            required: "密码不能为空",
            minlength: "密码长度不能小于{minlength}",
            maxlength: "密码长度不能大于{maxlength}",
            pattern: "请输入8-15位数字或英文组合"
        },
        confirmPassword: {
            required: "密码不能为空",
            minlength: "密码长度不能小于{minlength}",
            maxlength: "密码长度不能大于{maxlength}",
            pattern: "请输入6-12位数字或英文组合"
        },
        repeatPassword: {
            required: "重复密码不能为空",
            repeat: "两次密码输入不一致"
        },
        number: {
            required: "数字不能为空"
        },
        mobile: {
            required: "请输入手机号",
            mobile: "输入手机号格式不正确"
        },
        modelName: {
            w5cuniquecheck: "该设备型号已存在"
        },
        roomCode: {
            w5cuniquecheck: "该户号已存在"
        },
        industryRoomCode :{
            w5cuniquecheck: "该编号已存在"
        },
        roomNumber: {
            w5cuniquecheck: "该房号已存在"
        },
        customerName: {
            pattern: "请输入中文"
        },
        certificatesNo: {
            pattern: "证件号码有误"
        },
        factoryName: {
            w5cuniquecheck: "该生产厂家已存在"
        },
        chargePlan_name: {
            pattern: "名称不能包含特殊字符"
        },
        customerType_name: {
            pattern: "名称不能包含特殊字符"
        },
        discountPlan_name: {
            pattern: "名称不能包含特殊字符"
        },
        phoneNumber: {
            pattern: "手机号格式不正确"
        },
        idcard : {
            pattern: "身份证号格式不正确"
        },
        officeNumber : {
            pattern: "办公室号码格式不正确"
        },
        homeNumber : {
            pattern: "家庭号码格式不正确"
        }
    });
}]);

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
Date.prototype.Format = function (fmt) { //author: meizz

    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
    //var da = date.replace("年", "-").replace("月", "-").replace("日", "").replace(/-/g, "/").split(/\/|\:|\ /);
    //new Date(da[0],da[1]-1,da[2],da[3],da[4],da[5]).Format("yyyy-M-d");

}