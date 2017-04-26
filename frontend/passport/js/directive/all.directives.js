/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午10:00
 *
 */
(function() {
    'use strict';
    /**
     * 所有平台相关的指令
     */
    angular.module('app.directives', [])

    .directive('elheightresize', ['$window', function($window) {
        return {
            link: function(scope, elem, attrs) {
                scope.onResize = function() {
                    var header = document.getElementsByTagName('nav')[0];
                    elem.windowHeight = $window.innerHeight - 230;
                    if (attrs.wheing) {
                        elem.windowHeight = $window.innerHeight - attrs.wheing;
                    }
                    $(elem).height(elem.windowHeight);
                }
                scope.onResize();
                angular.element($window).bind('resize', function() {
                    scope.onResize();
                })
            }
        }
    }])
    /**
     * Author: dongwenzhao/kingdee
     * Date: 16/4/27
     * Time: 下午2:12
     *
     */
    .directive('ellipsis', ['$timeout', '$window', function($timeout, $window) {
            function shrinkElem(elem) {
                elem.innerHTML = elem.innerHTML.substr(0, elem.innerHTML.length - 3).trim() + '...';
            }

            return {
                restrict: 'A',
                scope: {},
                link: function(scope, elem, attr) {
                    elem.css({ overflow: 'hidden' });

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
        .directive('kdLoadingButton', [function() {
            return {
                'restrict': 'A',
                link: function(scope, ele, attrs) {
                    scope.$watch(function() {
                        return scope.$eval(attrs.kdLoadingButton);
                    }, function(value) {
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
        .directive('kdLoadingButtons', [function() {
            return {
                'restrict': 'A',
                link: function(scope, ele, attrs) {
                    scope.$watch(function() {
                        return scope.$eval(attrs.kdLoadingButtons);
                    }, function(value) {
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
        .directive('kdLoading', ['$rootScope', 'loadingOptions', function($rootScope, loadingOptions) {
            function extend(dst) {
                var deep = false,
                    i = 1;

                if (typeof dst === 'boolean') {
                    deep = dst;
                    dst = arguments[1] || {};
                    i++;
                }

                angular.forEach([].slice.call(arguments, i), function(obj) {
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
                link: function(scope, element, attrs) {
                    var spinner = null,
                        key = attrs.kdLoading || false,
                        options,
                        container,
                        body,
                        spinnerContainer,
                        text;
                    var start = function() {
                        if (container) {
                            container.addClass('kd-loading-active');
                        }
                        if (spinner) {
                            spinner.spin(spinnerContainer[0])
                        }
                    };

                    var update = function(newOptions, force) {
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

                    var finish = function() {
                        if (container) {
                            container.removeClass('kd-loading-active');
                        }
                        if (spinner) {
                            spinner.stop();
                        }
                    };

                    scope.$watch(attrs.kdLoadingOptions, function(newValue) {
                        update(newValue)
                    }, true);

                    $rootScope.$on('$loadingStart', function(event, loadKey) {
                        if (loadKey) {
                            start();
                        }
                    });

                    $rootScope.$on('$loadingUpdate', function(event, loadKey, options) {
                        if (loadKey === key) {
                            update(options, true);
                        }
                    });

                    $rootScope.$on('$loadingFinish', function(event, loadKey) {
                        if (loadKey === key) {
                            finish();
                        }
                    });

                    scope.$on('$destroy', function() {
                        finish();
                        spinner = null;
                    });
                }

            }
        }])
        /**
         * Author: dongwenzhao/kingdee
         * Date: 16/7/20
         * Time: 上午10:55
         *
         */
        .directive('goTo', [function() {
            return {
                restrict: 'A',
                scope: {},
                link: function(scope, elem, attr) {
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
        .directive('longText', ['$compile', function($compile) {
            return {
                restrict: 'A',
                template: '',
                compile: function(elem, attr, ctrl) {
                    return {
                        pre: function(scope, elem, attr) {
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
                                        .map(function(word) {
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
        .directive('backButton', [function() {
            return {
                restrict: 'A',

                link: function(scope, element, attrs) {
                    element.bind('click', goBack);

                    function goBack() {
                        history.back();
                        scope.$apply();
                    }
                }
            }
        }]);
})();
