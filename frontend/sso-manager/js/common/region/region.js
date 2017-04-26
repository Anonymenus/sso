//caoxiaoming 2015-7-1 16:39:14

var regionMenu = {
	/**
	 * 三级联动下拉选框id设置
	 * select:['ementId1','ementId3','ementId3']
	 */
	selectIds:[],
	/**
	 * title id
	 * @type {Array}
	 */
	selectTtiles:[],
	/**
	 * onchange时间绑定 联动菜单需占用onchange事件，这里可对一二级菜单追加onchange事件
	 * @type {Object}
	 */
	onchange:{
		//	'selectId':funtion(){
		//	  do something
		//	}
	},
	/**
	 * [ajaxdata description]
	 * @type {Object}
	 */
	ajaxdata:{
		//TODO 
	},
	/**
	 * 获取option选项值
	 * @param  {[type]} e select doom对象
	 * @return {[type]}   [description]
	 */
	getOptionValue:function(e){
		var temp_index = e.selectedIndex;
		return e.options[temp_index].value;
	},
	/**
	 * 获取option选项文本
	 * @param  {[type]} e select doom对象
	 * @return {[type]}   [description]
	 */
	getOptionText:function(e){
		var temp_index = e.selectedIndex;
		return e.options[temp_index].text;
	},
	/**
	 * 获取当前选中区域名称
	 * @return {[type]} [description]
	 */
	regionname:function(){
		var fir_id = this.selectIds[0];
		var sec_id = this.selectIds[1];
		var thi_id = this.selectIds[2];

		var thi = document.getElementById(thi_id);
		if(thi.childNodes.length > 0){
			var thi_text = this.getOptionText(thi);
			var thi_value = this.getOptionValue(thi);
			if(thi_value && thi_text && thi_value !=0){
				return thi_text;
			}	
		}
		
		var sec = document.getElementById(sec_id);
		if(sec.childNodes.length > 0){
			var sec_text = this.getOptionText(sec);
			var sec_value = this.getOptionValue(sec);
			if(sec_text && sec_value && sec_value !=0){
				return sec_text;
			}
		}
		
		var fir = document.getElementById(fir_id);
		if(fir.childNodes.length > 0){
			var fir_text = this.getOptionText(fir);
			var fir_value = this.getOptionValue(fir);
			if(fir_text && fir_value && fir_value !=0){
				return fir_text;
			}
		}
		
		return '';
	},
	/**
	 * 获取当前选中区域代码
	 * @return {[type]} [description]
	 */
	regioncode:function(){
		var fir_id = this.selectIds[0];
		var sec_id = this.selectIds[1];
		var thi_id = this.selectIds[2];
		var thi = document.getElementById(thi_id);
		if(thi.childNodes.length > 0){
			var thi_value = this.getOptionValue(thi);
			if(thi_value && thi_value !=0){
				// console.log('3:'+thi_value);
				return thi_value;
			}
		}
		var sec = document.getElementById(sec_id);
		if(sec.childNodes.length > 0){
			var sec_value = this.getOptionValue(sec);
			if( sec_value && sec_value !=0){
				// console.log('2:'+sec_value);
				return sec_value;
			}
		}
		var fir = document.getElementById(fir_id);
		if(fir.childNodes.length > 0){
			var fir_value = this.getOptionValue(fir);
			if( fir_value && fir_value !=0){
				// console.log('1:'+fir_value);
				return fir_value;
			}
			if(fir_value && fir_value ==0){
				return '';
			}
		}
		
		return 0;

	},
	
	/**
	 * [init description]
	 * 初始化三级联动菜单 
	 */
	init:function () {
		var fir_id = this.selectIds[0];
		var sec_id = this.selectIds[1];
		var thi_id = this.selectIds[2];

		var fir_title_id = this.selectTtiles[0];
		var sec_title_id = this.selectTtiles[1];
		var thi_title_id = this.selectTtiles[2];

		var fir_onchange = this.onchange[''+fir_id+''];
		var sec_onchange = this.onchange[''+sec_id+''];
		var thi_onchange = this.onchange[''+thi_id+''];
		//var thi_onchange = this.onchange[''+thi_id+''];
		if(!fir_id || !sec_id || !thi_id){
			console.error('init failed:need input:select id');
			return;
		}
		var fir = document.getElementById(fir_id);
		var sec = document.getElementById(sec_id);
		var thi = document.getElementById(thi_id);
		var fir_title =  document.getElementById(fir_title_id);
		var sec_title =  document.getElementById(sec_title_id);
		var thi_title =  document.getElementById(thi_title_id);
		var province_data = area_array;
		var city_data = sub_array;
		var area_data = sub_arr;
		if(!province_data || !area_data ){
			console.error('init failed:need region data');
			return;
		}
		var province_data_len = province_data.length;
		fir.options.add(new Option('全部',0));
		for(var i = 0; i < province_data_len; i++){
			if(! province_data[i] || i == 0) continue;
			fir.options.add(new Option(province_data[i],i));
		}
		var getSelectedOptionValue = this.getOptionValue;
		fir.onchange =function(){
			thi.style.display = '';
			thi_title.style.display = '';
			sec_title.innerHTML= '市：';
			var selected_value = getSelectedOptionValue(fir);
			if(selected_value == 0) {
				sec.options.length=0;
				sec.options.add(new Option('全部',0));
				thi.options.length = 0;
				thi.options.add(new Option('全部',0));
				if(typeof fir_onchange == 'function'){
					return fir_onchange();
				}
			}
			var sec_data = city_data[selected_value];
			var sec_data_len = sec_data.length;
			sec.options.length=0;
			sec.options.add(new Option('全部',0));
			var flag = false;
			for(var i =selected_value*100; i< sec_data_len;i++){
				if(!sec_data[i]) continue;
				sec.options.add(new Option(sec_data[i],i));
				if(flag==false && !area_data[i]){
					thi.style.display = 'none';
					thi_title.style.display = 'none';
					sec_title.innerHTML= '区：';
					flag = true;
				}
			}
			if(typeof fir_onchange == 'function'){
				return fir_onchange();
			}
		}
		sec.onchange = function(){
			//var fir_value = getSelectedOptionValue(fir);
			var sec_value =getSelectedOptionValue(sec);
			if(sec_value == 0){
				thi.options.length = 0;
				thi.options.add(new Option('全部',0));
				if(typeof sec_onchange == 'function'){
					return sec_onchange();
				}	
			}
			var thi_data = area_data[sec_value];
			if(!thi_data){
				thi.style.display = 'none';
				thi_title.style.display = 'none';
				// sec_title.innerHTML= '区';
				return;
			}
			thi.options.length = 0;
			var thi_data_len = thi_data.length;
			thi.options.add(new Option('全部',0));
			for(var i=sec_value*100;i<thi_data_len;i++){
				if(!thi_data[i]) continue;
				thi.options.add(new Option(thi_data[i],i));
			}
			if(typeof sec_onchange == 'function'){
				return sec_onchange();
			}
		}
		thi.onchange = function(){

			if(typeof thi_onchange == 'function'){

				return thi_onchange();
			}
		}
	}
}
