/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:42
 *
 */

'use strict';

angular.module('MainApp')
    .config(['$ocLazyLoadProvider', function($ocLazyLoadProvider) {
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [ {
                name: 'sweet',
                files: [
                    'bower_components/sweetalert/dist/sweetalert.css',
                    'bower_components/sweetalert/dist/sweetalert.min.js',
                    'bower_components/angular-sweetalert/dist/ngSweetAlert.min.js'
                ]
            }]
        });
    }]);
mainApp.config(["w5cValidatorProvider", function(w5cValidatorProvider) {

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
            pattern: "请输入6-12位数字或英文组合"
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
        phoneNumber: {
            pattern: "手机号格式不正确"
        }
    });
}]);
