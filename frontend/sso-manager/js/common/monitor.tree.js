  /**
   * 监控树
   * created by caoxiaoming 2015-07-22 16:52:50
   * @param {[type]} zid    ztree doom id
   * @param {[type]} setting ztree settings    
   * @param {[type]} pid    current product id
   * @param {[type]} result all product list
   * @param {[type]} filter 
   */
  var MONITOR_TREE = function(zid,setting,pid,result,filter,expend){
      var kw,pt,alarm,online;
      if(filter){
        kw = filter.keyword || null;
        pt = filter.type || '';
        // alarm = filter.alarm || -1;
        // online = filter.online || -1;
      }
      var products = result;
      // console.log(products);
      var len  = products.length;
      var nodes = [];
      var provinces =[];
      var citys = [];
      var areas = [];
      var special_nodes;
      for(var i = 0; i<len;i++){
        var pro = products[i];
        var pro_type = pro.product_type;
        var regionCode = pro.product_regioncode;
        var keyword = pro.product_keyword;
        var isopen = false;
        if(kw && keyword.indexOf(kw) <0){
          continue;
        }
        if(pt && pro_type != pt){
          continue;
        }
        var code = regionCode;
        if(code && code!=0){
          var province = code.substr(0,2);
          var city = code.substr(0,4);
          var area = code;

          if(provinces.indexOf(province) < 0 && area_array[province]){
            var node = {};
            provinces.push(province);
            node.id = province;
            node.name = area_array[province];
            node.pId = null;
            node.parent =true;
            nodes.push(node);
          }
          if(citys.indexOf(city) < 0&& sub_array[province] && sub_array[province][city]){
            var node = {};
            citys.push(city);
            node.id = city;
            node.name = sub_array[province][city];
            node.pId = province;
            node.parent = true;
            nodes.push(node);
          }
          if(areas.indexOf(area) <0 && sub_arr[city] &&sub_arr[city][area]){
            var node = {};
            areas.push(area);
            node.id = area;
            node.name = sub_arr[city][area];
            node.pId = city;
            node.nocheck = true;
            node.parent = true;
            nodes.push(node);
          } 
            var node = {};
            node.id = pro.product_id;
            node.name = pro.product_name;
            node.pId = area;
            if(code.substr(2,2) == '00'){
              node.pId = city;
            }
            if(code.substr(4,2) == '00'){
              node.pId = province;
            }
            if(pro.product_id==pid){
              node.font = {color:'#f2a050'};
            }
            node.parent = false;
            node.iconSkin="normal";
            if(pro.product_alarm){
              node.iconSkin="alarm";
            }
            if(pro.product_online == false){
              node.iconSkin = 'offline';
            }
            nodes.push(node);
        }else{
            if(!special_nodes){
              special_nodes = {
                id:-111,
                name:'其他',
                PId:null,
                nocheck:true,
                parent:true,
                iconSkin:''
              };
              nodes.push(special_nodes);
            }
            var pro = products[i];
            var node = {};
            node.id = pro.product_id;
            node.name = pro.product_name;
            node.pId = -111;
            if(pro.product_id==pid){
               node.font = {color:'#f2a050'};
            }
            node.iconSkin="normal";
             if(pro.product_alarm){
              node.iconSkin="alarm";
            }
            if(pro.product_online == false){
              node.iconSkin = 'offline';
            }
            node.parent = false;
            nodes.push(node);
        }
      }
      var zTree = $.fn.zTree.init($("#"+zid), setting, nodes);
      if(expend){
        zTree.expandAll(true);
        return zTree;
      }
      if(pid){
         var node = zTree.getNodeByParam("id",pid, null);
         if(node && node.pId){
            var pnode = zTree.getNodeByParam("id",node.pId, null);
            pnode.open = true;
            if( pnode &&pnode.pId){
              var ppnode = zTree.getNodeByParam("id",pnode.pId, null);
              ppnode.open = true;
              if(ppnode && ppnode.pId){
                var pppnode = zTree.getNodeByParam("id",ppnode.pId, null);
                zTree.expandNode(pppnode, true, true, true);
                return zTree;
              }
              zTree.expandNode(ppnode, true, true, true);
              return zTree;
            }
            zTree.expandNode(pnode, true, true, true);
            return zTree;
         }
      }
     return zTree;
  }