

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
		var timeStamp = Game.calServerTimeNow();
		//cc.log('st ' + timeStamp);
		NetWork.sendMessage([MsgType.csMove,timeStamp,degree,dirx,diry,posx,posy,vx,vy]);
	},

	ping:function(pingCount, clientTime){
		NetWork.sendMessage([MsgType.csPing, pingCount, clientTime])
	},

	eatEnegyBall:function(ballId){
		NetWork.sendMessage([MsgType.csEatEnegyBall, ballId])
	}

};