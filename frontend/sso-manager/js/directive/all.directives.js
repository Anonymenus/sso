/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午10:00
 *
 */
(function () {
    'use strict';
    angular
        .module('app.sidebar', [])
        .directive('sidebar', sidebar);
    sidebar.$inject = ['$rootScope', '$timeout', '$window', 'Utils'];

    function sidebar($rootScope, $timeout, $window, Utils) {
        var $win = angular.element($window);
        var directive = {
            link: link,
            restrict: 'EA',
            template: '<nav class="sidebar" ng-transclude></nav>',
            transclude: true,
            replace: true
        };
        return directive;

        function link(scope, element, attrs) {

            var currentState = $rootScope.$state.current.name;
            var $sidebar = element;

            var eventName = Utils.isTouch() ? 'click' : 'mouseenter';
            var subNav = $();

            $sidebar.on(eventName, '.nav > li', function () {

                if (Utils.isSidebarCollapsed() || $rootScope.app.layout.asideHover) {
                    subNav.trigger('mouseleave');
                    subNav = toggleMenuItem($(this), $sidebar);
                    sidebarAddBackdrop();
                }
            });
            scope.$on('closeSidebarMenu', function () {
                removeFloatingNav();
            });
            $win.on('resize', function () {
                if (!Utils.isMobile())
                    asideToggleOff();
            });
            $rootScope.$on('$stateChangeStart', function (event, toState) {
                currentState = toState.name;
                asideToggleOff();
                $rootScope.$broadcast('closeSidebarMenu');
            });
            if (angular.isDefined(attrs.sidebarAnyclickClose)) {
                var wrapper = $('.wrapper');
                var sbclickEvent = 'click.sidebar';
                $rootScope.$watch('app.asideToggled', watchExternalClicks);
            }
            function watchExternalClicks(newVal) {
                if (newVal === true) {
                    $timeout(function () { // render after current digest cycle
                        wrapper.on(sbclickEvent, function (e) {
                            if (!$(e.target).parents('.aside').length) {
                                asideToggleOff();
                            }
                        });
                    });
                } else {
                    wrapper.off(sbclickEvent);
                }
            }

            function asideToggleOff() {
                $rootScope.app.asideToggled = false;
                if (!scope.$$phase) scope.$apply(); // anti-pattern but sometimes necessary
            }
        }

        function sidebarAddBackdrop() {
            var $backdrop = $('<div/>', {
                'class': 'dropdown-backdrop'
            });
            $backdrop.insertAfter('.aside-inner').on('click mouseenter', function () {
                removeFloatingNav();
            });
        }

        function toggleTouchItem($element) {
            $element
                .siblings('li')
                .removeClass('open')
                .end()
                .toggleClass('open');
        }

        function toggleMenuItem($listItem, $sidebar) {
            removeFloatingNav();

            var ul = $listItem.children('ul');

            if (!ul.length) return $();
            if ($listItem.hasClass('open')) {
                toggleTouchItem($listItem);
                return $();
            }

            var $aside = $('.aside');
            var $asideInner = $('.aside-inner'); // for top offset calculation
            // float aside uses extra padding on aside
            var mar = parseInt($asideInner.css('padding-top'), 0) + parseInt($aside.css('padding-top'), 0);
            var subNav = ul.clone().appendTo($aside);

            toggleTouchItem($listItem);

            var itemTop = ($listItem.position().top + mar) - $sidebar.scrollTop();
            var vwHeight = $win.height();

            subNav
                .addClass('nav-floating')
                .css({
                    position: $rootScope.app.layout.isFixed ? 'fixed' : 'absolute',
                    top: itemTop,
                    bottom: (subNav.outerHeight(true) + itemTop - 130 > vwHeight) ? 0 : 'auto',
                    width: (subNav.outerHeight(true) + itemTop > vwHeight) ? '140px' : ' 128px'
                });

            subNav.on('mouseleave', function () {
                toggleTouchItem($listItem);
                subNav.remove();
            });

            return subNav;
        }

        function removeFloatingNav() {
            $('.dropdown-backdrop').remove();
            $('.sidebar-subnav.nav-floating').remove();
            $('.sidebar li.open').removeClass('open');
        }
    }

    /**
     * 所有平台相关的指令
     */
    angular.module('app.directives', [])
        /**
         * 分页指令
         */
        .directive('paging', [function () {
            return {
                restrict: 'E',
                template: '',
                replace: true,
                link: function (scope, element, attrs) {

                    scope.$watch('numPages', function (value) {
                        scope.pages = [];
                        var begin = Math.max(1, scope.currentPage - 4 / 2);
                        var end = Math.min(begin + (4 - 1), scope.numPages);
                        //console.debug(begin+":"+end+":"+scope.numPages+":num");
                        for (var i = begin; i <= end; i++) {
                            scope.pages.push(i);
                        }
                    });

                    scope.$watch('currentPage', function (value) {
                        scope.pages = [];
                        var begin = Math.max(1, value - 4 / 2);
                        var end = Math.min(begin + (4 - 1), scope.numPages);
                        //console.debug(begin+":"+end+":"+scope.numPages+":cur");
                        for (var i = begin; i <= end; i++) {
                            scope.pages.push(i);
                        }
                    });
                    scope.isActive = function (page) {
                        return scope.currentPage === page;
                    };
                    scope.selectPage = function (page) {
                        if (!scope.isActive(page)) {
                            scope.currentPage = page;
                            scope.onSelectPage(page);
                        }
                    };
                    scope.selectPrevious = function () {
                        if (!scope.noPrevious()) {
                            scope.selectPage(scope.currentPage - 1);
                        }
                    };
                    scope.selectNext = function () {
                        if (!scope.noNext()) {
                            scope.selectPage(scope.currentPage + 1);
                        }
                    };
                    scope.noPrevious = function () {
                        return scope.currentPage <= 1;
                    };
                    scope.noNext = function () {
                        return scope.currentPage >= scope.numPages;
                    };

                }
            };
        }])
        .directive('preloader', ['$animate', '$timeout', '$q', function ($animate, $timeout, $q) {
            return {
                restrict: 'EAC',
                template: '<div class="preloader-progress">' +
                '<div class="preloader-progress-bar" ' +
                'ng-style="{width: loadCounter + \'%\'}"></div>' +
                '</div>',
                link: function (scope, el) {
                    scope.loadCounter = 0;

                    var counter = 0,
                        timeout;

                    // disables scrollbar
                    angular.element('body').css('overflow', 'hidden');
                    // ensure class is present for styling
                    el.addClass('preloader');

                    appReady().then(endCounter);

                    timeout = $timeout(startCounter);

                    ///////

                    function startCounter() {

                        var remaining = 100 - counter;
                        counter = counter + (0.015 * Math.pow(1 - Math.sqrt(remaining), 2));

                        scope.loadCounter = parseInt(counter, 10);

                        timeout = $timeout(startCounter, 20);
                    }

                    function endCounter() {

                        $timeout.cancel(timeout);

                        scope.loadCounter = 100;

                        $timeout(function () {
                            // animate preloader hiding
                            $animate.addClass(el, 'preloader-hidden');
                            // retore scrollbar
                            angular.element('body').css('overflow', '');
                        }, 300);
                    }

                    function appReady() {
                        var deferred = $q.defer();
                        var viewsLoaded = 0;
                        // if this doesn't sync with the real app ready
                        // a custom event must be used instead
                        var off = scope.$on('$viewContentLoaded', function () {
                            viewsLoaded++;
                            // we know there are at least two views to be loaded
                            // before the app is ready (1-index.html 2-app*.html)
                            if (viewsLoaded === 2) {
                                // with resolve this fires only once
                                $timeout(function () {
                                    deferred.resolve();
                                }, 3000);

                                off();
                            }

                        });

                        return deferred.promise;
                    }

                }
            }
        }])
        .directive('elheightresize', ['$window', function ($window) {
            return {
                link: function (scope, elem, attrs) {
                    scope.onResize = function () {
                        var header = document.getElementsByTagName('nav')[0];
                        elem.windowHeight = $window.innerHeight - 200 - 64;
                        if (attrs.wheing) {
                            elem.windowHeight = $window.innerHeight - attrs.wheing;
                        }
                        $(elem).height(elem.windowHeight);
                    }
                    scope.onResize();
                    angular.element($window).bind('resize', function () {
                        scope.onResize();
                    })
                }
            }
        }])
        .directive('containerresize', ['$window', function ($window) {
            return {
                link: function (scope, elem, attrs) {
                    scope.onResize = function () {
                        elem.windowHeight = $window.innerHeight - 115;
                        $(elem).height(elem.windowHeight);
                        $(elem).css({
                            "padding-top": "10px",
                            "overflow-y": "auto",
                            "overflow-x": "hidden"
                        })
                    }
                    scope.onResize();
                    angular.element($window).bind('resize', function () {
                        scope.onResize();
                    })
                }
            }
        }])
        .directive('searchOpen', [function () {
            return {
                restrict: 'A',
                controller: ['$scope', '$element', 'NavSearch', function ($scope, $element, NavSearch) {
                    $element
                        .on('click', function (e) {
                            e.stopPropagation();
                        })
                        .on('click', NavSearch.toggle);
                }]
            }
        }])
        .directive('searchDismiss', [function () {
            return {
                restrict: 'A',
                controller: ['$scope', '$element', 'NavSearch', function ($scope, $element, NavSearch) {
                    var inputSelector = '.navbar-form';

                    $(inputSelector)
                        .on('click', function (e) {
                            e.stopPropagation();
                        })
                        .on('keyup', function (e) {
                            if (e.keyCode === 27) // ESC
                                NavSearch.dismiss();
                        });

                    // click anywhere closes the search
                    $(document).on('click', NavSearch.dismiss);
                    // dismissable options
                    $element
                        .on('click', function (e) {
                            e.stopPropagation();
                        })
                        .on('click', NavSearch.dismiss);
                }]
            }
        }])
        .directive('settingBox', [function () {
            return {
                restrict: 'A',
                controller: ['$scope', '$element', 'settingBox', function ($scope, $element, settingBox) {
                    $element
                        .on('click', function (e) {
                            e.stopPropagation();
                        })
                        .on('click', settingBox.toggle);
                }]
            }
        }])
        .directive('settingDismiss', [function () {
            return {
                restrict: 'A',
                controller: ['$scope', '$element', 'settingBox', function ($scope, $element, settingBox) {
                    var checkSelector = '.setting-box';

                    $(checkSelector)
                        .on('click', function (e) {
                            e.stopPropagation();
                        })
                    // click anywhere closes the search
                    $(document).on('click', settingBox.dismiss);
                    // dismissable options
                    $element
                        .on('click', function (e) {
                            e.stopPropagation();
                        })
                        .on('click', settingBox.dismiss);
                }]
            }
        }])
        /**
         * Author: dongwenzhao/kingdee
         * Date: 16/4/27
         * Time: 下午2:12
         *
         */
        .directive('ellipsis', ['$timeout', '$window', function ($timeout, $window) {
            function shrinkElem(elem) {
                elem.innerHTML = elem.innerHTML.substr(0, elem.innerHTML.length - 3).trim() + '...';
            }

            return {
                restrict: 'A',
                scope: {},
                link: function (scope, elem, attr) {
                    elem.css({overflow: 'hidden'});

                    function runShrink() {
                        shrinkElem(elem[0])
                    }

                    $timeout(runShrink, 10);
                    angular.element($window).on('resize', runShrink);
                }
            }

        }])
        /**
         * loading button
         * @Author   DongWenZhao
         * @DateTime 2016-04-15
         */
        .directive('kdLoadingButton', [function () {
            return {
                'restrict': 'A',
                link: function (scope, ele, attrs) {
                    scope.$watch(function () {
                        return scope.$eval(attrs.kdLoadingButton);
                    }, function (value) {
                        if (value) {
                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                ele.addClass('disabled')
                                    .attr('disabled', 'disabled');
                            }
                            ele.data('resetText', ele.html());
                            ele.html(attrs.loadingText);
                        } else {
                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                ele.removeClass('disabled')
                                    .removeAttr('disabled');
                            }
                            ele.html(ele.data('resetText'));
                        }
                    });
                }
            }
        }])
        .directive('kdLoadingButtons', [function () {
            return {
                'restrict': 'A',
                link: function (scope, ele, attrs) {
                    scope.$watch(function () {
                        return scope.$eval(attrs.kdLoadingButtons);
                    }, function (value) {
                        if (value) {
                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                ele.addClass('disabled')
                                    .attr('disabled', 'disabled');
                            }
                            ele.data('resetText', ele.html());
                            ele.html(attrs.loadingText);
                        } else {
                            if (!attrs.hasOwnProperty('ngDisabled')) {
                                ele.removeClass('disabled')
                                    .removeAttr('disabled');
                            }
                            ele.html(ele.data('resetText'));
                        }
                    });
                }
            }
        }])
        /**
         * Author: dongwenzhao/kingdee
         * Date: 16/5/17
         * Time: 下午1:49
         * Example: kd-loading="users" kd-loading-options={text:'Loding'}
         * 调用: 开始 $loading.start('user')  结束 $loading.finish('user')
         *
         */
        .directive('kdLoading', ['$rootScope', 'loadingOptions', function ($rootScope, loadingOptions) {
            function extend(dst) {
                var deep = false,
                    i = 1;

                if (typeof dst === 'boolean') {
                    deep = dst;
                    dst = arguments[1] || {};
                    i++;
                }

                angular.forEach([].slice.call(arguments, i), function (obj) {
                    var array, clone, copy, key, src;

                    for (key in obj) {
                        src = dst[key];
                        copy = obj[key];

                        if (dst === copy) {
                            continue;
                        }

                        if (deep && copy && (angular.isObject(copy) ||
                            (array = angular.isArray(copy)))) {

                            if (array) {
                                clone = (src && angular.isArray(src)) ? src : [];
                            } else {
                                clone = (src && angular.isObject(src)) ? src : {};
                            }

                            dst[key] = extend(deep, clone, copy);
                        } else if (copy !== undefined) {
                            dst[key] = copy;
                        }
                    }
                });

                return dst;
            }

            return {
                link: function (scope, element, attrs) {
                    var spinner = null,
                        key = attrs.kdLoading || false,
                        options,
                        container,
                        body,
                        spinnerContainer,
                        text;
                    var start = function () {
                        if (container) {
                            container.addClass('kd-loading-active');
                        }
                        if (spinner) {
                            spinner.spin(spinnerContainer[0])
                        }
                    };

                    var update = function (newOptions, force) {
                        finish();
                        options = extend(true, {}, loadingOptions, newOptions);
                        // templates
                        body = angular.element("<div class='ball-spin-fade-loader' ></div>").addClass("kd-loading-body");
                        container = angular.element('<div></div>').addClass("kd-loading").append(body);

                        if (options.overlay) {
                            container.addClass("kd-loading-overlay")
                        }
                        if (options.className) {
                            container.addClass("options.className")
                        }
                        if (options.spinner) {
                            spinnerContainer = angular.element('<i class="fa fa-spinner fa-spin"></i>');
                            body.append(spinnerContainer);
                            // spinner = new Spinner(options.spinnerOptions);
                        }
                        if (options.text) {
                            text = angular.element('<div></div>').addClass("kd-loading-text").text(options.text);
                            body.append(text)
                        }

                        element.append(container);

                        if (options.active || key || force) {
                            start()
                        }
                    };

                    var finish = function () {
                        if (container) {
                            container.removeClass('kd-loading-active');
                        }
                        if (spinner) {
                            spinner.stop();
                        }
                    };

                    scope.$watch(attrs.kdLoadingOptions, function (newValue) {
                        update(newValue)
                    }, true);

                    $rootScope.$on('$loadingStart', function (event, loadKey) {
                        if (loadKey) {
                            start();
                        }
                    });

                    $rootScope.$on('$loadingUpdate', function (event, loadKey, options) {
                        if (loadKey === key) {
                            update(options, true);
                        }
                    });

                    $rootScope.$on('$loadingFinish', function (event, loadKey) {
                        if (loadKey === key) {
                            finish();
                        }
                    });

                    scope.$on('$destroy', function () {
                        finish();
                        spinner = null;
                    });
                }

            }
        }])
        .directive('slimscroll', ['$timeout', '$window', function ($timeout, $window) {
            return {
                restrict: 'A',
                link: function ($scope, $elem, $attr) {
                    var off = [];
                    var option = {};

                    var refresh = function () {
                        $timeout(function () {
                            if (angular.isDefined($attr.slimscroll)) {
                                option = $scope.$eval($attr.slimscroll) || {};
                            } else if ($attr.slimscrollOption) {
                                option = $scope.$eval($attr.slimscrollOption) || {};
                            }

                            var el = angular.element($elem);

                            el.slimScroll({destroy: true});
                            el.slimScroll(option);
                        });
                    };
                    angular.element($window).bind('resize', function () {
                        if ($attr.slimscroll) {
                            option = $scope.$eval($attr.slimscroll);
                        } else if ($attr.slimscrollOption) {
                            option = $scope.$eval($attr.slimscrollOption);
                        }

                        $($elem).slimScroll(option);
                    });

                    var registerWatch = function () {
                        if (angular.isDefined($attr.slimscroll) && !option.noWatch) {
                            off.push($scope.$watchCollection($attr.slimscroll, refresh));
                        }

                        if ($attr.slimscrollWatch) {
                            off.push($scope.$watchCollection($attr.slimscrollWatch, refresh));
                        }

                        if ($attr.slimscrolllistento) {
                            off.push($scope.$on($attr.slimscrolllistento, refresh));
                        }
                    };

                    var destructor = function () {
                        angular.element($elem).slimScroll({destroy: true});
                        off.forEach(function (unbind) {
                            unbind();
                        });
                        off = null;
                    };

                    off.push($scope.$on('$destroy', destructor));

                    registerWatch();
                }
            };
        }])
        /**
         * Author: dongwenzhao/kingdee
         * Date: 16/7/20
         * Time: 上午10:55
         *
         */
        .directive('goTo', [function () {
            return {
                restrict: 'A',
                scope: {},
                link: function (scope, elem, attr) {
                    elem.bind('click', goBack);

                    function goBack() {
                        location.href = attr.goTo
                    }
                }
            }
        }])
        /**
         * [description]
         * @date   2016-08-03
         * @author DongWenZhao
         * 字符串长度过长显示
         * long-text-tooltip-delay 延迟显示
         * long-text 显示文本
         * max-total-characters 设置字符长度
         * max-word-length
         */
        .directive('longText', ['$compile', function ($compile) {
            return {
                restrict: 'A',
                template: '',
                compile: function (elem, attr, ctrl) {
                    return {
                        pre: function (scope, elem, attr) {
                            scope.attr = attr;
                            function truncateText() {
                                var ellipsis = '…';
                                var maxWordLength = parseInt(attr.maxWordLength, 10);
                                var maxTotalCharacters = parseInt(attr.maxTotalCharacters, 10);
                                var maxCharRegex = RegExp('.{' + maxTotalCharacters + '}');
                                var maxWordRegex = RegExp('.{' + maxWordLength + '}');
                                var tooltipDelay = parseInt(attr.longTextTooltipDelay || 150, 10);
                                var tooltipPoint = attr.tooltipPoint || top;

                                var wrapPrefix = '',
                                    wrapSuffix = '';

                                function setWrapperElements() {
                                    wrapPrefix = '<span tooltip-placement="' + tooltipPoint + '"  tooltip="' + attr.longText + '" tooltip-popup-delay="' + tooltipDelay + '">';
                                    wrapSuffix = '</span>';
                                }

                                var cleanedText = attr.longText.replace(/<[^>]*?>/g);

                                if (maxWordLength) {
                                    cleanedText = cleanedText
                                        .split(' ')
                                        .map(function (word) {
                                            var truncatedWord;
                                            if (word.length > maxWordLength) {
                                                truncatedWord = maxWordRegex.exec(word);
                                                word = truncatedWord + ellipsis;
                                                setWrapperElements();
                                            }
                                            return word;
                                        })
                                        .join(' ');
                                }

                                if (maxTotalCharacters && cleanedText.length > maxTotalCharacters) {
                                    setWrapperElements();
                                    cleanedText = maxCharRegex.exec(cleanedText) + ellipsis;
                                }

                                elem.html(wrapPrefix + cleanedText + wrapSuffix);
                                $compile(elem.contents())(scope);
                            }

                            scope.$watch('attr.longText', truncateText);
                            scope.$watch('attr.maxWordLength', truncateText);
                            scope.$watch('attr.maxTotalCharacters', truncateText);
                            scope.$watch('attr.longTextTooltipDelay', truncateText);
                            scope.$watch('attr.tooltipPoint', truncateText);
                        }
                    };
                }
            };
        }])
        .directive('backButton', [function () {
            return {
                restrict: 'A',

                link: function (scope, element, attrs) {
                    element.bind('click', goBack);

                    function goBack() {
                        history.back();
                        scope.$apply();
                    }
                }
            }
        }]);

})();

