var aaangularjsapplication =
    angular.module('aaangularjsapplication', []);


aaangularjsapplication.directive('aadropdownmultiselect', [function() {
    return {
        restrict: 'E',
        scope: {
            model: '=',
            multiselectoptions: '=',
            maxlenghttoshowselectedvalues: '=',
            onchangeeventofcheckbox: '&',
            confirm: '&'
        },
        template:
        '<div class="btn-group" ng-class={open:open}> \
            <button type="button" class="multiselect dropdown-toggle btn btn-default" title="None selected" ng-click="toggledropdown($event)"> \
                <span class="multiselect-selected-text">{{model.toggletext}}</span> \
                <span class="multiselect-selected-caret"><b class="caret"></b> </span> \
            </button> \
            <ul class="multiselect-container dropdown-menu"> \
                <li class="multiselect-item filter" value="0"> \
                    <div class="input-group"> \
                        <span class="input-group-addon"><i class="fa fa-search"></i></span> \
                        <input class="form-control multiselect-search" type="text" placeholder="查询" ng-model="model.query"><span class="input-group-btn"> \
                            <button class="btn btn-default multiselect-clear-filter" ng-click="clearsearch()" type="button"><i class="fa fa-close"></i></button> \
                        </span> \
                    </div> \
                </li> \
                <li class="multiselect-item multiselect-all"> <div class="checkbox c-checkbox"> <label> <input type="checkbox" ng-model="model.selectall" ng-change="toggleselectall()"> <span class="fa fa-check"></span>全选 </label> <button class="btn btn-success pull-right" ng-click="confirmst()">确定</button></div> </li> \ <li ng-repeat="option in (filteredOptions = (multiselectoptions| filter:model.query))"> <div class="checkbox c-checkbox"> <label> <input type="checkbox" ng-checked="isselected(option)" ng-model="option.Selected" ng-change="toggleselecteditem(option);doOnChangeOfCheckBox()"> <span class="fa fa-check"></span>{{option.Text}} </label> </div> </li> \ </ul> \
        </div>',
        link: function(scope, element, attrs) {
            scope.confirmst = function() {
                scope.open = !scope.open;
                scope.confirm();
            }

            element.on("click",function($event){
                  $event.stopPropagation();
            })
        },
        controller: ['$scope', function($scope) {
            $scope.toggledropdown = function(e) {
                e.stopPropagation();
                $scope.open = !$scope.open;
            };


            $(document).on("click", function() {
                $scope.$apply(function() {
                    $scope.open = false;
                })
            })
            $scope.toggleselectall = function() {
                var selectallclicked = true;
                if ($scope.model.selectall == false) {
                    selectallclicked = false;
                }
                $scope.doonselectallclick(selectallclicked, $scope.filteredOptions);
            };

            $scope.doonselectallclick = function(selectallclicked, optionArrayList) {
                $scope.model = [];
                if (selectallclicked) {
                    angular.forEach(optionArrayList, function(item, index) {
                        item["Selected"] = true;
                        $scope.model.push(item);
                    });

                    if (optionArrayList.length == $scope.multiselectoptions.length && optionArrayList.length > 0) {
                        $scope.model.selectall = true;
                    }
                } else {
                    angular.forEach(optionArrayList, function(item, index) {
                        item["Selected"] = false;
                    });
                    $scope.model.selectall = false;
                }
                $scope.settoggletext();
            }

            $scope.toggleselecteditem = function(option) {
                var intIndex = -1;
                angular.forEach($scope.model, function(item, index) {
                    if (item.Value == option.Value) {
                        intIndex = index;
                    }
                });

                if (intIndex >= 0) {
                    $scope.model.splice(intIndex, 1);
                } else {
                    $scope.model.push(option);
                }

                if ($scope.model.length == $scope.multiselectoptions.length) {
                    $scope.model.selectall = true;
                } else {
                    $scope.model.selectall = false;
                }
                $scope.settoggletext();
            };

            $scope.clearsearch = function() {
                $scope.model.query = "";
            }

            $scope.settoggletext = function() {
                if ($scope.model.length > $scope.maxlenghttoshowselectedvalues) {
                    $scope.model.toggletext = $scope.model.length + " Selected";
                } else {
                    $scope.model.toggletext = "";
                    angular.forEach($scope.model, function(item, index) {
                        if (index == 0) {
                            $scope.model.toggletext = item.Text;
                        } else {
                            $scope.model.toggletext += ", " + item.Text;
                        }
                    });

                    if (!($scope.model.toggletext.length > 0)) {
                        $scope.model.toggletext = "请选择"
                    }
                }
            }

            $scope.isselected = function(option) {
                var selected = false;
                angular.forEach($scope.model, function(item, index) {
                    if (item.Value == option.Value) {
                        selected = true;
                    }
                });
                option.Selected = selected;
                return selected;
            }

            $scope.doOnChangeOfCheckBox = function() {
                $scope.onchangeeventofcheckbox();
            }

            var onload = function() {
                if ($scope.model.length == $scope.multiselectoptions.length) {
                    $scope.doonselectallclick(true, $scope.multiselectoptions);
                }
                $scope.settoggletext();
            }();
        }]
    }
}]);
