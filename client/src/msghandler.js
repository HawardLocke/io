

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
		NetWork.registHandler(MsgType.scEnegyInfo, this.onEnegyInfo);
		NetWork.registHandler(MsgType.scEatEnegyBall, this.onEatEnegyBall);
		NetWork.registHandler(MsgType.scEnegyChange, this.onEnegyChange);
		NetWork.registHandler(MsgType.scShoot, this.onShoot);
		NetWork.registHandler(MsgType.scBulletInfo, this.onBulletInfo);
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
			playerInst.isLocalPlayer = true;
		}
	},

	onWorldInfo:function(args){
		Game.worldWidth = args[1];
		Game.worldHeight = args[2];
		gameScene.getWorldLayer().RefreshWorldInfo();
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
		var timestamp = args[8];

		var curTime = Game.calServerTimeNow();
		var dt = (curTime - timestamp)/1000;
		//if(guid != Game.myPlayerGuid)
		//	cc.log("dt " + dt + " server time" + Game.serverTime + " ping time" + Game.pingTime);
		var dx = vx * dt + 0.5 * fx * Math.pow(dt,2);
		var dy = vy * dt + 0.5 * fy * Math.pow(dt,2);
		x += dx;
		y += dy;
		vx += fx * Setting.acc_control * dt;
		vy += fy * Setting.acc_control * dt;

		//cc.log('x ' + x);
		//cc.log('y ' + y);

		var playerInst = Game.getPlayer(guid);
		if (playerInst instanceof Player){
			playerInst.setPosition(x, y);
			playerInst.setVelocity(vx, vy);
			playerInst.setForce(fx, fy);
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
	},

	onEnegyInfo:function(args){
		//cc.log('on enegy info' + args);
		var guid = args[1];
		var x = args[2];
		var y = args[3];
		var enegy = args[4];
		Game.addEnegyBall(guid, x, y, enegy);
	},

	onEatEnegyBall:function(args){
		var playerId = args[1];
		var ballId = args[2];
		var playerInst = Game.getPlayer(playerId);
		var enegyBall = Game.getEnegyBall(ballId);
		//cc.log('recv eat ' + ballId);
		enegyBall.flyTo(playerInst.getPositionX(), playerInst.getPositionY());
		if (playerId == Game.myPlayerGuid){
			playerInst.onEatEnegyBall(ballId);
		}else{

		}
	},

	onEnegyChange:function(args){
		var playerId = args[1];
		var enegy = args[2];
		var playerInst = Game.getPlayer(playerId);
		playerInst.changeEnegy(enegy);
		if (playerId == Game.myPlayerGuid){

		}else{

		}
	},

	onBulletInfo:function(args){
		var bulletId = args[1];
		var playerId = args[2];
		var level = args[3];
		var timeStamp = args[4];
		var x = args[5];
		var y = args[6];
		var vx = args[7];
		var vy = args[8];

		var curTime = Game.calServerTimeNow();
		var dt = (curTime - timeStamp)/1000;
		var dx = vx * dt;
		var dy = vy * dt;
		x += dx;
		y += dy;
		cc.log('bullet (' + x + ', ' + y + '), (' + vx + ', ' + vy + ')');

		Game.addBullet(bulletId,playerId,level,timeStamp,x,y,vx,vy);
	},

	onShoot:function(args){
		/*var bulletId = args[1];
		var playerId = args[2];
		var dirx = args[3];
		var diry = args[4];*/
	}

};