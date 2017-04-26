'user strict';

mainApp.controller('threeMenuCtrl', ['$scope', '$rootScope','$state', function($scope, $rootScope,$state) {

    $rootScope.getMenuItemPropClasses = function(item) {
        var params = "";
        if (item && item.params) {
            params = item.params;
            if (Object.prototype.toString.call(params) === "[object String]") {
                item.params = $.parseJSON(params);
            }
        }
        return (item.heading ? 'nav-heading' : '') +
            (isActive(item) ? ' active' : '');
    };

    // Check item and children active state
    function isActive(item) {
        if (!item || item == undefined) return;

        if (!item.url || item.url.indexOf('#') > -1) {
            var foundActive = false;
            angular.forEach(item.children, function(value) {
                if (isActive(value)) foundActive = true;

            });
            return foundActive;

        } else
            return $state.is(item.url, item.params) || $state.includes(item.url, item.params);
    }


}])
