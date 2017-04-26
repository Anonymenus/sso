mainApp.controller('HeadController', ['$rootScope', '$scope','Auth','$http', function($rootScope, $scope, Auth, $http){
            $scope.logout = function() {
                if($rootScope.user && $rootScope.user._orgCode){
                    location.href = "../login.html" + "#/" + $rootScope.user._orgCode;
                }else{
                    location.href = "../login.html";
                }

            }
    }]);