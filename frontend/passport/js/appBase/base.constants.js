/**
 * User:kingdee
 * Date: 16/10/20
 * Time: 上午9:43
 *
 */
'use strict';
angular.module('MainApp').value('loadingOptions', {
    active: false, // 默认加载状态
    text: 'Loading...', // 文字
    className: '',
    overlay: true,
    spinner: true,
    spinnerOptions: {
        lines: 12,
        length: 7,
        width: 4,
        radius: 10,
        rotate: 0,
        corners: 1,
        color: '#000',
        direction: 1,
        speed: 2,
        trail: 100,
        opacity: 1 / 4,
        fps: 20,
        zIndex: 2e9,
        className: 'kd-spinner',
        top: 'auto',
        left: 'auto',
        position: 'relative'
    }
});
/**
 * 定义各个设备的全局参数。
 * 2015-10-28 by Dongwenzhao
 */
angular.module('app.core', [])
    .constant('APP_MEDIAQUERY', {
        'desktopLG': 1200,
        'desktop': 992,
        'tablet': 768,
        'mobile': 480
    });
