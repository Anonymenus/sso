/**
 * 【检测浏览器是否支持】
 * var support =  RealTime.support();
 * // support为boolean值。
 * if(support){ // 表示支持。 }else{ // 表示不支持。 }
 * 
 * 【获取webnow】
 * var webnow = RealTime.connect(url);
 * 
 * 【处理消息接收（事件绑定）】
 * webnow.receive(function(msg){
 *     // 对接收的msg进行处理。
 * });
 */
var RealTime = (function(window){
	function _getWebSocket(){
		var _WebSocket = window.WebSocket;
		if (!_WebSocket) {
			_WebSocket = window.MozWebSocket;
		}
		return _WebSocket;
	}
	
	function _connect(_WebSocket,url){
		if(url.indexOf("ws://")!=0){
			url = "ws://"+url;
		}
		if(url==null || url==""){
			return null;
		}
		var socket = new _WebSocket(url);
		return socket;
	}
	
	function support(){
		var _WebSocket = _getWebSocket();
		if(_WebSocket){
			return true;
		}else{
			return false;
		}
	}
	
	function connect(url,params){
		var _WebSocket = _getWebSocket();
		if (_WebSocket) {
			var socket = _connect(_WebSocket,url);
			if(socket==null) {
				return new WebNow(null,params);
			}
			var webnow = new WebNow(socket,params);
			return webnow;
		} else {
			throw new Error("Your browser version is too low, unable to support real-time communication");
			return null;
		}
	}
	
	function _toJson(o){
		var json = '{';
		for (var i in o) {
			json += ('"'+i+'"'+':');
			json += ('"'+o[i] +'"'+ ',');
		}
		json = json.substring(0,json.length-1) + "}";
		return json;
	}
	
	function WebNow(socket,params){
		if(socket==null){
			return ;
		}
		
		var _socket = socket;
		var _params = params;
		var _reconnect = 0;
		var lastPongTime = 0;
		var _OnMsgCallback = function(){}
		var timeIntervalCode = 0;
		
		function setSocekt(s){
			_socket = s;
		}
		
		// 向外暴露socket借口。
		this.socket = function(){
			return _socket;
		}

		this.setOnMsgCallback = function(onMsgCallback){
			_OnMsgCallback = onMsgCallback;
		}
		
		function _keepalive(socket){
			timeIntervalCode = setInterval(function(){
				// 5 min , time over.
				if(new Date().getTime()-lastPongTime>1000*60*2){
					// close
					if(timeIntervalCode>0){
						_socket.close();
					}
					return ;
				}
				socket.send("~HB~");
			},30000);
		}
		
		// 链接创建成功。
		_socket.onopen = function(evt){
			window.console.log("The connection has been open.");
			// now time
			lastPongTime = new Date().getTime();
			// 连接成功，重连次数清0。
			_reconnect = 0;
			// 注意函数内部，this即为当前函数的拥有者。即Socket对象。
			if(_params){
				var json = _toJson(_params);
				_socket.send(json);
			}
			
			_keepalive(_socket);
		}
		
		// 错误处理。
		_socket.onerror = function(evt){
			// 最多重新连接3次。
			// 当前WebSocket已经关闭连接。
			if(_reconnect<=3 && _socket.readyState == WebSocket.CLOSED){
				window.console.log("connection exception..."+evt.toString());
				// 重新连接。
				var newSocket = _connect(_getWebSocket(),_socket.url);
				// 事件绑定。
				newSocket.onopen = _socket.onopen
				newSocket.onmessage = _socket.onmessage;
				newSocket.onclose = _socket.onclose;
				newSocket.onerror = _socket.onerror;
				// 替换。
				setSocekt(_socket);
			}
			// 连接失败，重连次数增加。
			_reconnect += 1;
		}
		
		// 链接关闭事件。
		_socket.onclose = function(){
			window.console.log("The connection has been closed.");
			window.clearInterval(timeIntervalCode);
		}
		
		_socket.onmessage = function(evt){
			var text = evt.data;
			if(text=="~BH~"){
				lastPongTime = new Date().getTime();
				return ;
			}
			// callback
			_OnMsgCallback(text);
		}
	}
	
	WebNow.prototype.receive = function(onMsgCallback){
		this.setOnMsgCallback(onMsgCallback);
	}
	
	var _realtime = {
		"connect":connect,
		"support":support
	};
	return _realtime;
})(window);