/*
 * 版本管理
 * 说明:
 * 第一位：大版本号 或产品序列
 * 第二位：升级版本
 * 第三位：迭代版本
 * 第四位：开发版
 * 例如：1.0.2 即生产环境版本
 *       1.0.2.1 测试版本
 */
var version = "1.0.2.1";
var jsHash = {
    commons:[
            {url:'js/common/base.js',version:version},
            // {url:'js/common/message-realtime/realtime-message.js',version:version},
            {url:'js/common/directives.js',version:version},
            {url:'js/common/services/services.js',version:version},
            // {url:'js/common/region/Area.js',version:version},
            // {url:'js/common/region/region.js',version:version},
            {url:'js/common/region/AreaData_min.js',version:version},
            {url:'js/common/zTree/V3/js/jquery.ztree.core-3.5.js',version:version},
            {url:'js/common/zTree/V3/js/jquery.ztree.excheck-3.5.js',version:version},
            // {url:'js/common/filters/filters.js',version:version},
            // {url:'js/common/jsmap.js',version:version},
            // {url:'js/common/utils.js',version:version},
            // {url:'js/common/jquery.vticker.min.js',version:version},
            // {url:'js/common/stepper/js/jquery.fs.stepper.min.js',version:version},
            // {url:'js/common/precise-math.min.js',version:version},
            // {url:'js/common/LodopFuncs.js',version:version},
            // {url:'js/common/jquery.select.js',version:version},
            // {url:'plugin/My97DatePicker/WdatePicker.js'},
            // //{url:'plugin/temper/js/goal-thermometer.js'}
            // {url:'js/common/protocol.js'},
            // {url:'js/common/monitor.tree.js'}

    ],
    // controllers:[
    //         {url:'js/appMain/controllers/mainController.js',version:version},
    //         {url:'js/appBase/controllers/baseController.js',version:version},
    //         {url:'js/appBase/controllers/accountController.js',version:version},
    //         {url:'js/appBase/controllers/authController.js',version:version},
    //         {url:'js/appBase/controllers/deviceController.js',version:version},
    //         {url:'js/appBase/controllers/productController.js',version:version},
    //         {url:'js/appBase/controllers/productParameterTemplateController.js',version:version},
    //         {url:'js/appBase/controllers/liquidCheckListController.js',version:version},
    //         {url:'js/appBase/controllers/enterpriseController.js',version:version},
    //         {url:'js/appBase/controllers/organizationController.js',version:version},
    //         // {url:'js/appBase/controllers/authRoleController.js',version:version},
    //         {url:'js/appBase/controllers/authMenuController.js',version:version},
    //         // {url:'js/appBase/controllers/pushController.js',version:version},
    //         {url:'js/appBase/controllers/customerSubAccount.js',version:version},
    //         {url:'js/appBase/controllers/vehicleController.js',version:version},
    //         {url:'js/appMonitor/controllers/mainController.js',version:version},
    //         {url:'js/appMonitor/controllers/mapController.js',version:version},
    //         {url:'js/appMonitor/controllers/loopDataController.js',version:version},
    //         //2015-7-6 20:16:02
    //         {url:'js/appMonitor/controllers/monitorMeterContoller.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorLngContoller.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorTreeController.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorDetailTreeController.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorReportController.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorModuleController.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorConsumptionController.js',version:version},

    //         {url:'js/appMonitor/controllers/monitorSetAlarmController.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorEventController.js',version:version},

    //         {url:'js/appMessage/controllers/mainController.js',version:version},

    //         {url:'js/appOperate/controllers/mainController.js',version:version},
    //         {url:'js/appOperate/controllers/customerController.js',version:version},
    //         {url:'js/appMonitor/controllers/monitorEventController.js',version:version},
    //         {url:'js/appOperate/controllers/commodityController.js',version:version},
    //         {url:'js/appOperate/controllers/accountSupplierController.js',version:version},
    //         {url:'js/appOperate/controllers/accountPurchaseController.js',version:version},
    //         {url:'js/appOperate/controllers/accountFlowController.js',version:version},
    //         {url:'js/appOperate/controllers/accountInfoController.js',version:version},
    //         {url:'js/appOperate/controllers/accountRecController.js',version:version},
    //         {url:'js/appOperate/controllers/accountRecResultController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidDemandController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidTaskWorkerController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidTaskSupplierController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidTaskInfoController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidOrderSupplierController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidOrderWorkerController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidOrderPurchaseController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidOrderInfoController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidOrderPayController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidOrderPayInfoController.js',version:version},
    //         {url:'js/appOperate/controllers/liquidRecordController.js',version:version},
    //         {url:'js/appOperate/controllers/reportMarketController.js',version:version},
    //         {url:'js/appOperate/controllers/reportNormalController.js',version:version},
    //         {url:'js/appOperate/controllers/reportCustomerController.js',version:version},
    //         {url:'js/appOperate/controllers/monthlyBillController.js',version:version},
    //         {url:'js/appOperate/controllers/monthlyBillInfoController.js',version:version},
    //         {url:'js/appOperate/controllers/cumulativeFlow.js',version:version},
    //         {url:'js/appOperate/controllers/initialValueController.js',version:version},
    //         {url:'js/appOperate/controllers/flowSettleRecordController.js',version:version},
    //         {url:'js/appOperate/controllers/truckController.js',version:version},
    //         {url:'js/appOperate/controllers/gasStationController.js',version:version},
    //         {url:'js/appOperate/controllers/truckChangeRecordController.js',version:version},
    //         {url:'js/appOperate/controllers/fillingRecordController.js',version:version},
    //         {url:'js/appOperate/controllers/gasCommodityController.js',version:version},
    //         {url:'js/appOperate/controllers/fillingRecordPrintController.js',version:version},
    //         {url:'js/appOperate/controllers/reportLiquidRecordController.js',version:version},
    //         {url:'js/appOperate/controllers/spareController.js',version:version},
    //         {url:'js/appOperate/controllers/spareDetailController.js',version:version}
    // ],
    directives:[
            // {url:'js/appMonitor/directives/directives.js',version:version},
            // {url:'js/appMain/directives/directives.js',version:version},
            // {url:'js/appOperate/directives/directives.js',version:version},
            {url:'js/appBase/directives/directives.js',version:version}
    ],
    services:[
            // {url:'js/appBase/services/dataBaseServices.js',version:version}
    ]
}
