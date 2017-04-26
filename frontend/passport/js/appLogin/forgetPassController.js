'use strict';

angular.module('MainApp.forgetPass', [])
    .controller('forgetPassCtrl', ['$scope', 'sweet', '$state', '$interval','$stateParams','passwordResetService', function($scope, sweet, $state, $interval,$stateParams,passwordResetService) {
        $scope.goLogin = function() {
            var url = SSO_LOGIN_URL+"?appKey="+$scope.appKey+"&appType="+ $scope.appType+"&returnUrl="+ $scope.returnUrl;
            window.location.href = url;
        }
        $scope.lng = {
            forgetPwdStep: 1
        }
        $scope.validateCode = '';

        $scope.appKey = $stateParams.appKey;
        $scope.returnUrl = $stateParams.returnUrl;
        $scope.appType = $stateParams.appType;

        $scope.employee = {};
        $scope.paracont = "获取验证码";
        $scope.goTime = '5s';
        var timePromise = '', timePromise2 = '', second = 60, seconds = 5;

        //第一步填写登录名
        $scope.getAccountMobile = function() {
            passwordResetService.getAccountByUsername($scope.employee.username).then(function (result) {
                if (result.code == "100"){
                    $scope.employee.mobile = result.mobile;
                    $scope.employee.maskMobile = result.maskMobile;
                    $scope.accountId = result.accountId;
                    $scope.lng.forgetPwdStep = 2;
                }else{
                    sweet.show({title: 'Error', text: result.message, timer: 2000, showConfirmButton: false});
                }


            })

        }


        //修改密码 step1 发送验证码
        //发送验证码
        $scope.paracont = "获取验证码";
        var second = 60;
        var timePromise = '';
        $scope.employee.mobile = '';

        $scope.sendDynamicCode = function() {
            var regx = /^1\d{10}$/;
            var mobile = $scope.employee.mobile;

            if (!regx.test(mobile)) {
                sweet.show('手机号码有误');
                return;
            }
            $scope.clickButton = true;

            timePromise = $interval(function() {
                if (second <= 0) {
                    $interval.cancel(timePromise);
                    timePromise = undefined;
                    second = 60;
                    $scope.paracont = "重发验证码";
                    $scope.clickButton = false;

                } else {
                    $scope.paracont = second + "秒后可重发";
                    second--;
                    $scope.clickButton = true;
                }
            }, 1000, 100);
            passwordResetService.sendDynamicCode($scope.accountId).then(function (result) {
                if (result.code == "100"){
                    $scope.clickButton = false;
                    var validateCode = result.validateCode;
                    if (!$.isEmptyObject(validateCode)) {
                        sweet.show({
                            title: '验证码',
                            text: validateCode,
                            timer: 2000,
                            showConfirmButton: false
                        });

                    }
                }else{
                    sweet.show({title: 'Error', text: result.message, timer: 2000, showConfirmButton: false});
                }

            });


        }

        //第二步 身份验证
        $scope.validateMobile = function() {
            // alert($scope.validateCode + " " + $("#validateCode").val());
            // return;
            var validateCode = $("#validateCode").val();
            console.log("validateCode=" + $scope.validateCode);

            passwordResetService.validateMobile($scope.accountId, validateCode).then(function (result) {
                if (result.code == "100"){
                    $scope.lng.forgetPwdStep = 3;
                    $scope.validateCode = validateCode;
                }else{
                    sweet.show({title: 'Error', text: result.message, timer: 2000, showConfirmButton: false});
                }
            });

        }

        //第二步 修改密码
        $scope.resetPassword = function() {
            var loginPassword = $("#loginPassword").val();
            var reLoginPassword = $("#reLoginPassword").val();
            passwordResetService.resetPassword($scope.accountId,loginPassword,reLoginPassword, $scope.validateCode).then(function (result) {

                var code = result.code;
                if (code == "100"){
                    $scope.lng.forgetPwdStep = 4;
                    timePromise2 = $interval(function() {
                        if (seconds <= 0) {
                            $interval.cancel(timePromise2);
                            timePromise2 = undefined;
                            seconds = 5;
                            $state.go("login");
                        } else {
                            $scope.goTime = seconds + "s";
                            seconds--;
                        }
                    }, 1000, 100);

                }else{
                    sweet.show({
                        title: 'Error',
                        text: result.message,
                        timer: 2000,
                        showConfirmButton: false
                    });
                }

            });
        }


    }])
    .factory('passwordResetService', ['Restangular', function(Restangular) {
        var service = {};
        var _passwordResetService = Restangular.setBaseUrl(LOGIN_URL).all('password-reset');
        service.getAccountByUsername = function(username) {
            return _passwordResetService.get('account-mobile',{
                "username":username
            });
        }

        service.sendDynamicCode = function (accountId) {
            return _passwordResetService.customPOST({}, 'send/'+accountId, {}, {});
        }

        service.validateMobile = function (accountId,validateCode) {
            var map = {
                "accountId": accountId,
                "validateCode": validateCode
            };
            return _passwordResetService.customPUT(map, 'validate-mobile', {}, {});

        }

        service.resetPassword = function (accountId,password,rePassword,validateCode) {
            var map = {
                "accountId": accountId,
                "password":password,
                "rePassword":rePassword,
                "validateCode": validateCode
            };
            return _passwordResetService.customPUT(map, '', {}, {});

        }
        return service;

}]);
