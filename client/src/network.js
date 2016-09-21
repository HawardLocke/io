
var NetWork = {

	websock:null,
	msgHandlers:{},

	init:function(){
		var ws_url = "ws://127.0.0.1:5000/connect";
		this.websock = new WebSocket(ws_url);
		this.websock.onopen = this.onOpen;
		this.websock.onmessage = this.onMessage;
		this.websock.onerror = this.onError;
	},

	onOpen:function(e){
		cc.log("NetWork open: "+e.message);
	},

	onMessage:function(e) {
		json = JSON.parse(e.data);
		if (!(json[0] instanceof Array))
			json = [json];

		for (var i = 0; i < json.length; i++) {
			var args = json[i];
			var cmd = json[i][0];
			cc.log("cmd is "+cmd)
			var handlers = this.msgHandlers[cmd];
			if (handlers == null){
				for (var h = 0; h < json.length; h++){
					handlers[h](args);
				}
			}
		}
	},

	onError:function(e){
		cc.log("NetWork error......");
	},

	sendMessage:function(msgArray) {
		if (this.websock != null && this.websock.readyState == WebSocket.OPEN){
			var msg = JSON.stringify(msgArray);
			this.websock.send(msg);
		}
		else {
			cc.log("sendMessage: socket is closed");
		}
	},

	registHandler:function(msg, handler){
		if (this.msgHandlers[msg] == null){
			this.msgHandlers[msg] = [];
		}
		if (msg != null && handler != null && msg != undefined && handler != undefined && handler instanceof Function){
			var handlerArray = this.msgHandlers[msg];
			handlerArray[handlerArray.length] = handler;
		}
	}
};


var MsgType = {
	// c->s
	csNewPlayer:1001,
	csJoin:1002,
	csMove:1003,
	// s->c
	scError:2000,
	scNewPlayer:2001,
	scJoined:2002,
	scWorldInfo:2003,
	scDeletePlayer:2004
};

