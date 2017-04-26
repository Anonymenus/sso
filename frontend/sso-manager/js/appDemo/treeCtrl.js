'use strict';

angular.module('MainApp', [])
    .controller('treeCtrl', ['$scope', function($scope) {
        $scope.bag = [{
            label: 'Glasses',
            value: 'glasses',
            children: [{
                label: 'Top Hat',
                value: 'top_hat'
            }, {
                label: 'Curly Mustache',
                value: 'mustachio'
            }]
        }];

        $scope.awesomeCallback = function(node, tree) {
            // Do something with node or tree
        };

        $scope.otherAwesomeCallback = function(node, isSelected, tree) {
            // Do soemthing with node or tree based on isSelected
        }
    }]).config(function(ivhTreeviewOptionsProvider) {
        ivhTreeviewOptionsProvider.set({
            twistieCollapsedTpl: '<span class="fa fa-plus-square"></span>',
            twistieExpandedTpl: '<span class="fa fa-minus-square"></span>',
           twistieLeafTpl: '<span class="fa fa-file-text"></span>'

            // twistieLeafTpl: '&#9679;'
        });
    });
