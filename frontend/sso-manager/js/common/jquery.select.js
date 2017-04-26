


var JquerySelect=function(jqueryObj){
	this.$obj = jqueryObj;
};
JquerySelect.prototype = {
  
   getSelectObj : function(){
	   return this.$obj.get(0);
   },
   	//得到select项的个数     
	size : function() {
		return this.getSelectObj().options.length;
	},
	//获得选中项的索引     
	getSelectedIndex : function() {
		return this.getSelectObj().selectedIndex;
	},
	//获得当前选中项的文本     
	getSelectedText : function() {
		if (this.size() == 0) return "下拉框中无选项";
		else {
			var index = this.getSelectedIndex();
			return this.getSelectObj().options[index].text;
		}
	},	
	//获得IDS
	getValueArray : function() {
		var si = this.size();
		var sb = "";
		var idArray = new Array();
		for (var i = 0; i < si; i++) {
			idArray.push(this.getSelectObj().options[i].value);
		}
		return idArray;
	},
	
	getTextArray : function() {
		var si = this.size();
		var textArray = new Array();
		for (var i = 0; i < si; i++) {
			textArray.push(this.getSelectObj().options[i].text);
		}
		return textArray;
	},
	
	//获得IDS
	getIds : function() {
		var si = this.size();
		var sb = "";
		for (var i = 0; i < si; i++) {
			sb += this.getSelectObj().options[i].value + ",";
		}
		return sb;
	},
	//获得当前选中项的值     
	getSelectedValue : function() {
		if (this.size() == 0){
			return -1;
		}else{
			this.getSelectObj().value;
		}
	},

	//设置select中值为value的项为选中     
	setSelectedValue : function(value) {
		this.getSelectObj().value = value;
	},

	//设置select中文本为text的第一项被选中     
	setSelectedText : function(text) {
		var isExist = false;
		var count = this.size();
		for (var i = 0; i < count; i++) {
			if (this.getSelectObj().options[i].text == text) {
				this.getSelectObj().options[i].selected = true;
				isExist = true;
				break;
			}
		}
		if (!isExist) {
			alert("下拉框中不存在该项");
		}
	},
	//设置选中指定索引项     
	setSelectedIndex : function(index) {
		var count = this.size();
		if (index >= count || index < 0) {
			alert("选中项索引超出范围");
		}
		else {
			this.getSelectObj().selectedIndex = index;
		}
	},
	//判断select项中是否存在值为value的项     
	isExistItem : function(value) {
		var isExist = false;
		var count = this.size();
		for (var i = 0; i < count; i++) {
			if (this.getSelectObj().options[i].value == value) {
				isExist = true;
				break;
			}
		}
		return isExist;
	},
	//向select中添加一项，显示内容为text，值为value,如果该项值已存在，则提示     
	addOption : function(text, value) {
		if (this.isExistItem(value)) {
			//alert("待添加项的值已存在");
		}
		else {
			this.getSelectObj().options.add(new Option(text, value));
		}
	},
	//删除select中值为value的项，如果该项不存在，则提示     
	removeItem : function(value) {
		if (this.isExistItem(value)) {
			var count = this.size();
			for (var i = 0; i < count; i++) {
				if (this.getSelectObj().options[i].value == value) {
					this.getSelectObj().remove(i);
					break;
				}
			}
		}
		else {
			alert("待删除的项不存在!");
		}
	},
	//删除select中指定索引的项     
	removeIndex : function(index) {
		var count = this.size();
		if (index >= count || index < 0) {
			alert("待删除项索引超出范围");
		}
		else {
			this.getSelectObj().remove(index);
		}
	},
	//删除select中选定的项     
	removeSelected : function() {
		var index = this.getSelectedIndex();
		this.removeIndex(index);
	},
	//清除select中的所有项     
	clearAll : function() {
		this.getSelectObj().options.length = 0;
	}  
};