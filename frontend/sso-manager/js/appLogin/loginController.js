/**
 * Created by sunshun on 2016/10/26.
 */

'use strict';
angular.module('MainApp', [])
    .controller('loginCtrl', ['$scope', '$state','Auth', '$loading', 'sweet', 'loginService', function($scope, $state,Auth, $loading, sweet, loginService) {
        

        $scope.account = new Object();

        
        $scope.login = function () {
            loginService.login($scope.account.loginName, $scope.account.password).then(function (result) {
                var user = new Object();
                user.accountId = result.accountId;
                user.accountType = result.accountType;
                user.token = result.token;
                Auth.setUser(user);
                $state.go("sso.organization");

            });
            
        }



       


    }])
    .factory('loginService', ['Restangular', function (Restangular) {
        var service = {};
        var _loginService = Restangular.setBaseUrl(LOGIN_URL).all('login');
        service.login = function (loginName, password) {
            var map = {
                "loginName":loginName,
                "password": password
            }
            return _loginService.post(map);
        }
        return service;

    }]);
