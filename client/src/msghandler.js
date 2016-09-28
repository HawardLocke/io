

var MsgHandler = {

	init:function(){
		NetWork.registHandler(MsgType.scError, this.onError);
		NetWork.registHandler(MsgType.scNewPlayer, this.onStart);
		NetWork.registHandler(MsgType.scJoined, this.onPlayerJoin);
		NetWork.registHandler(MsgType.scWorldInfo, this.onWorldInfo);
		NetWork.registHandler(MsgType.scDeletePlayer, this.onPlayerDeleted);
		NetWork.registHandler(MsgType.scTransform, this.onPlayerTransform);
		NetWork.registHandler(MsgType.scPlayerInfo, this.onPlayerInfo);
		NetWork.registHandler(MsgType.scPing, this.onPing);
	},

	onError:function(args){
		cc.log('Error: ' + args[1]);
	},

	onStart:function(args){
		var name = args[1];
		var guid = args[2];
		cc.log("on start, name " + name + ", guid " + guid);
		Game.myPlayerGuid = guid;
		Game.changeState(StateType.ST_PLAY);
	},

	onPlayerJoin:function(args){
		cc.log("on join: " + args);
		var guid = args[1];
		var name = args[2];
		var tp = args[3];
		var x = args[4];
		var y = args[5];
		var playerInst = Game.addPlayer(guid, name, tp, x, y);
		if (Game.myPlayerGuid === guid){
			Game.myPlayerInst = playerInst;
			//Game.lookAtPlayer(playerInst);
		}
	},

	onWorldInfo:function(args){
		Game.worldWidth = args[1];
		Game.worldHeight = args[2];
	},

	onPlayerDeleted:function(args){
		Game.removePlayer(args[1]);
	},

	onPlayerTransform:function(args){
		//cc.log("on trans: " + args);
		var guid = args[1];
		var x = args[2];
		var y = args[3];
		var vx = args[4];
		var vy = args[5];
		var fx = args[6];
		var fy = args[7];

		var playerInst = Game.getPlayer(guid);
		if (playerInst instanceof Player){
			playerInst.setPosition(x, y);
			playerInst.setVelocity(vx, vy);
			playerInst.setForce(fx, fy);
			if (guid == Game.myPlayerGuid){
				//Game.lookAtPlayer(playerInst);
			}
		}
	},

	onPlayerInfo:function(args){
		var guid = args[1];
		var name = args[2];
		var tp = args[3];
		var x = args[4];
		var y = args[5];
		if (guid != Game.myPlayerGuid) {
			Game.addPlayer(guid, name, tp, x, y);
		}
	},

	onPing:function(args){
		//cc.log('on ping');
		var pingCount = args[1];
		var networkDelayTime = args[2];
		//Game.serverTime = pingCount;
		Game.networkDelayTime = networkDelayTime;
		var localDate = new Date();
		var times = localDate.getTime();
		MsgSender.ping(pingCount, times);
	}

};