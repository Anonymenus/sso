//实时消息-临时写入
function rtmessage(token){

    var support = RealTime.support();
    if(support){
        var webnow = RealTime.connect(RT_MESSAGE,{"authId":token});
        webnow.receive(function(msg){
            try{
                var alarm_message = JSON.parse(msg);
                var title = "报警信息";
                var productId = alarm_message.productId; //产品ID
                var productName = alarm_message.productTitle; //产品名称
                var msg = "产品ID:"+productId+"<br>"+"产品名称:"+productName+"<br>";
                if(alarm_message.type == 'event'){ //报警
                    var events = alarm_message.events;
                    for(var a=0;a<events.length;a++) {
                        var data = events[a];
                        if(a>0){
                            msg = msg + '<br>';
                        }
                        msg = msg + data.content;
                    }

                }else if(alarm_message.type == 'outline'){ //离线
                    msg = msg +"已离线！";

                }else if(alarm_message.type == 'warning'){ //预警
                    var type = "";
                    if(alarm_message.compareType == 'true'){
                        type = "过高！";
                    }else if(alarm_message.compareType == 'false'){
                        type = "过低！";
                    }
                    msg = msg + "模块:"+alarm_message.moduleName+type+"<br>实时数值:"+alarm_message.realValue+"("+alarm_message.moduleUnit+")";
                }
                msg = msg + "<br>" + new Date().Format('yyyy-MM-dd hh:mm:ss');
                $('#rt_message').jGrowl(msg,{header:title,sticky: true});

            }catch(e){
                console.debug(e);
            }
        });
    }else{
        $('#rt_message').jGrowl("您的浏览器版本过低，无法支持实时通讯。");
    }
}

// 将任意整数分解成2的N次方数的组合。
// 返回数组。
function resolve(level){
    var n = 0;
    var i = 0;
    var list=[];
    while(level >= n){
        var t = 1<<i;
        if((level&t)>0){
            list.push(t);

        }
        n=t;
        i++;
    }
    return list;
}
