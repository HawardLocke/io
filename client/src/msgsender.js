

var MsgSender = {

	init:function(){

	},

	newPlayer:function(name, seed){
		NetWork.sendMessage([MsgType.csNewPlayer, name, seed]);
	},

	join:function(){
		NetWork.sendMessage([MsgType.csJoin]);
	},

	move:function(x, y){
		var localDate = new Date();
		var times = localDate.getTime();
		NetWork.sendMessage([MsgType.csMove,times,x,y]);
	},

	ping:function(pingCount, clientTime){
		NetWork.sendMessage([MsgType.csPing, pingCount, clientTime])
	}

};