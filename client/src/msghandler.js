

var MsgHandler = {

	init:function(){
		NetWork.registHandler(MsgType.scNewPlayer, this.onStart);
		NetWork.registHandler(MsgType.scJoined, this.onPlayerJoin);
		NetWork.registHandler(MsgType.scTransform, this.onPlayerTransform);
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
		var x = args[4]*Game.worldSizeRatio;
		var y = args[5]*Game.worldSizeRatio;
		var playerInst = Game.addPlayer(guid, name, tp, x, y);
		if (Game.myPlayerGuid === guid){
			Game.myPlayerInst = playerInst;
			MsgHandler.lookAtPlayer(playerInst);
		}
	},

	lookAtPlayer:function(playerInst){
		var wl = gameScene.getWorldLayer();
		var dx = cc.winSize.width * 0.5 - playerInst.getPositionX();
		var dy = cc.winSize.height * 0.5 - playerInst.getPositionY();
		wl.setPosition(dx, dy);
	},

	onPlayerTransform:function(args){
		//cc.log("on trans: " + args);
		var guid = args[1];
		var x = args[2]*Game.worldSizeRatio;
		var y = args[3]*Game.worldSizeRatio;
		var playerInst = Game.getPlayer(guid);
		if (playerInst instanceof Player){
			playerInst.setPosition(x, y);
			if (guid == Game.myPlayerGuid){
				MsgHandler.lookAtPlayer(playerInst);
			}
		}
	}

};