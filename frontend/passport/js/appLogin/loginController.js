/**
 * Created by sunshun on 2016/10/26.
 */

'use strict';
angular.module('MainApp', [])
    .controller('loginCtrl', ['$scope', '$state','$stateParams','$location', 'Auth', '$loading', 'sweet', 'loginService', '$cookieStore','localStorageService','accountTokenService', function($scope, $state,$stateParams,$location, Auth, $loading, sweet, loginService, $cookieStore,localStorageService,accountTokenService) {
        $scope.account = new Object();
        $scope.pwdRegx = /^(?!^[0-9]+$)(?!^[a-zA-Z]+$)(?!^[_#@$]+$)[0-9A-Za-z_#@$]{8,15}$/;
        $scope.returnUrl = '';
        $scope.appKey = '';
        $scope.appType = '';
        // $scope.isLogin = Auth.isLoggerIn();
        $scope.isLogin = false;

        $scope.checkLogin  = function () {
            var ssoUser = Auth.getUser();

            if ($.isEmptyObject(ssoUser)){
                $scope.isLogin = false;
                return;

            }
            var token = ssoUser.token;
            if ($.isEmptyObject(token)){
                $scope.isLogin = false;
                return;

            }
            accountTokenService.checkAccountToken(token,$scope.appKey,$scope.appType).then(function(result) {
                var code = result.code;
                if (code != "100"){
                    $scope.isLogin = false;
                }else{
                    $scope.isLogin = true;
                    //如果用户登录成功 取出userName
                    $scope.loginName = ssoUser.username;
                }
            });


        }

        $scope.getLoginInfo = function() {
            var paramMap = $location.search();
            var returnUrl = paramMap.returnUrl;
            if (returnUrl){
                returnUrl = decodeURIComponent(returnUrl);
                $scope.returnUrl = returnUrl;
            }
            var appKey = paramMap.appKey;
            if (appKey){
                $scope.appKey = appKey;
            }
            var appType = paramMap.appType;
            if (appType){
                $scope.appType = appType;
            }

            if (localStorageService.cookie.get("ssoUserName")) {
                $scope.account.loginName = localStorageService.cookie.get("ssoUserName");
            }
            if (localStorageService.cookie.get("ssoPass")) {
                $scope.account.password = localStorageService.cookie.get("ssoPass");
            }
            $scope.checkLogin();
        }
        //忘记密码修改
        $scope.forgetPassword = function(){
            $state.go('forgetPass',{
                "appKey": $scope.appKey,
                "appType": $scope.appType,
                "returnUrl": encodeURIComponent($scope.returnUrl)
            });
        }
        $scope.getLoginInfo();

       // 简单秘密提示框
        $scope.simplePass = false;
      // 简单秘密修改跳转
       $scope.resetPassword = function(){
           $state.go('resetPass', {
               "username": $scope.account.loginName,
               "appKey": $scope.appKey,
               "appType": $scope.appType,
               "returnUrl": encodeURIComponent($scope.returnUrl)
           });
       }
        $scope.validatePassword = function() {
            var reg = $scope.pwdRegx;
            var pwd = $scope.account.password;
            if (!reg.test(pwd)) {
                $scope.simplePass = true;
            } else {
                $scope.simplePass = false;
            }
            return !$scope.simplePass;

        }
        



        //登录请求 放进cookies里去
        $scope.login = function() {
                loginService.login($scope.account.loginName, $scope.account.password,$scope.returnUrl,$scope.appKey,$scope.appType).then(function(result) {

                    var code = result.code;
                    if (code != "100"){
                        var message = result.message;
                        sweet.show({title: 'Error', text: message, timer: 2000, showConfirmButton: false});
                        return;
                    }

                    var valid = $scope.validatePassword();
                    if (!valid) {
                        return;
                    }
                    var token = result.token;
                    var user = new Object();
                    user.username = $scope.account.loginName
                    user.token = token;
                    Auth.setUser(user);
                    //todo token
                    var returnUrl = result.returnUrl;
                    returnUrl = returnUrl+"?token="+token;
                    window.location.href = returnUrl;
                });
            }

        //切换账号
        $scope.loginOut = function() {
                Auth.logout();
                window.location.reload();
            }
         //点击进入 需要跳转的地址
        $scope.goTo = function() {
         var paramMap = $location.search();
            var returnUrl = paramMap.returnUrl;
            var token = '';
            if (returnUrl){
                returnUrl = decodeURIComponent(returnUrl);
                $scope.returnUrl = returnUrl;
            }
            var ssoUser = Auth.getUser();
             token = ssoUser.token;
              returnUrl += "?token="+token;
               window.location.href = returnUrl
            }
         //记住密码
        $scope.savaLoginInfo = function(username, password) {
            localStorageService.cookie.set("ssoUserName", username, 30);
            localStorageService.cookie.set("ssoPass", password, 30);
        }





    }])
    .factory('loginService', ['Restangular', function(Restangular) {
        var service = {};
        var _loginService = Restangular.setBaseUrl(LOGIN_URL).all('login');
        service.login = function(loginName, password,returnUrl,appKey,appType) {
            var map = {
                "loginName": loginName,
                "password": password,
                "returnUrl" : returnUrl
            }
            return _loginService.customPOST(map, '', {}, {'X-Lngtop-App-Key': appKey,'X-Lngtop-App-Type':appType});
        }
        return service;

    }])
    .factory('accountTokenService', ['baseRestService', function(baseRestService) {
        var service = {};
        var _authService = baseRestService.all('auth');
        service.checkAccountToken = function(token,appKey,appType) {
            return _authService.get('check-token', {},
                {'X-Lngtop-App-Key': appKey,
                 'X-Lngtop-App-Type':appType,
                  'X-Lngtop-Session-Token':token
                }
            );
        }
        return service;

}])
;
