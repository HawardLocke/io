

var MsgSender = {

	init:function(){

	},

	newPlayer:function(name, seed){
		NetWork.sendMessage([MsgType.csNewPlayer, name, seed]);
	},

	join:function(){
		NetWork.sendMessage([MsgType.csJoin]);
	},

	move:function(degree,dirx, diry, posx, posy, vx, vy){
		var localDate = new Date();
		var curTime = localDate.getTime();
		var timeStamp = Game.serverTime + (curTime - Game.pingTime);// 'real' time now
		NetWork.sendMessage([MsgType.csMove,timeStamp,degree,dirx,diry,posx,posy,vx,vy]);
	},

	ping:function(pingCount, clientTime){
		NetWork.sendMessage([MsgType.csPing, pingCount, clientTime])
	}

};