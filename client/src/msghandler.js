

var MsgHandler = {

	init:function(){
		NetWork.registHandler(MsgType.scError, this.onError);
		NetWork.registHandler(MsgType.scNewPlayer, this.onStart);
		NetWork.registHandler(MsgType.scJoined, this.onPlayerJoin);
		NetWork.registHandler(MsgType.scWorldInfo, this.onWorldInfo);
		NetWork.registHandler(MsgType.scDeletePlayer, this.onPlayerDeleted);
		NetWork.registHandler(MsgType.scMove, this.onPlayerMove);
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
		var color = args[6];
		var playerInst = Game.addPlayer(guid, name, tp, x, y, color);
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

	onPlayerMove:function(args){
		//cc.log("on trans: " + args);
		var guid = args[1];
		var x = args[2];
		var y = args[3];
		var vx = args[4];
		var vy = args[5];
		var fx = args[6];
		var fy = args[7];
		var stamptime = args[8];

		var playerInst = Game.getPlayer(guid);
		if (playerInst instanceof Player){
			playerInst.setPosition(x, y);
			playerInst.setVelocity(vx, vy);
			playerInst.setForce(fx, fy);
			var radians = -Math.atan2(y, x);
			var degree = 180 * radians / 3.141592659;
			playerInst.setRotation(degree);
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
		var color = args[6];
		if (guid != Game.myPlayerGuid) {
			Game.addPlayer(guid, name, tp, x, y, color);
		}
	},

	onPing:function(args){
		//cc.log('on ping');
		var pingCount = args[1];
		var networkDelayTime = args[2];
		var serverTime = args[3];
		Game.networkDelayTime = networkDelayTime;
		Game.serverTime = serverTime + networkDelayTime;// 'real' time of server now
		var localDate = new Date();
		var clientTime = localDate.getTime();
		Game.pingTime = clientTime;
		MsgSender.ping(pingCount, clientTime);
	}

};