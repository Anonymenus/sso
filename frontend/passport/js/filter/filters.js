'use strict';

/* Filters */

//以下是appBase里面的过滤器，一些数据库原始字段类型转换

angular.module('app.filters', []).filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        }
    }]);