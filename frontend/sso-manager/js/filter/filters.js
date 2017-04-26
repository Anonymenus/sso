'use strict';

/* Filters */

//以下是appBase里面的过滤器，一些数据库原始字段类型转换

angular.module('app.filters', []).filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]).filter('toDateTime', [function() {
        var DateTimeFilter = function(input) {
            var value = "无";
            if (input != null && input != '' && input != 'undefined') {
                value = new Date(input).Format("yyyy-MM-dd hh:mm:ss");
            }
            return value;
        }
        return DateTimeFilter;
    }]).filter('toDateTime_yyyy_MM_dd', [function() {
        var DateTimeFilter = function(input) {
            var value = "无";
            if (input != null && input != '' && input != 'undefined') {
                value = new Date(input).Format("yyyy-MM-dd");
            }
            return value;
        }
        return DateTimeFilter;
    }]).filter('toManagerAccountType', [function() {
        var ManagerAccountTypeFilter = function(input) {
            var value = "无";
            if(input == 1){
                value = "超级管理员"
            }else if(input == 2){
                value = "一般管理员"
            }
            return value;
        }
        return ManagerAccountTypeFilter;
    }]).filter('employeeStatusFilter', [function() {
    var filter = function(input) {
        var value = "无";
        if(input == 1){
            value = "启用"
        }else if(input == 0){
            value = "禁用"
        }
        return value;
    }
    return filter;
}]).filter('employeePositionFilter', [function() {
    var filter = function(input) {
        var value = "无";
        if(input == 1){
            value = "司机"
        }else if(input == 3){
            value = "市场部经理"
        }else if(input == 4){
            value = "财务人员"
        }else if(input == 2){
            value = "其他"
        }
        return value;
    }
    return filter;
}]).filter('validateFilter', [function() {
    var filter = function(input) {
        var value = "无";
        if(input == 0){
            value = "否"
        }else if(input == 1){
            value = "是"
        }
        return value;
    }
    return filter;
}]);