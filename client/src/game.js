
var StateType = {
	ST_ACCOUNT:1,
	ST_PLAY:2,
	ST_OVER:3
};


var Game = {

	statusMap:{},
	state:0,

	gameScene:null,

	worldWidth:0,
	worldHeight:0,

	playerCount:0,
	playerList:{},
	deletePlayerList:{},
	myPlayerGuid:0,
	myPlayerInst:null,

	serverTime:0,		// ms
	networkDelayTime:0,	// ms
	pingTime:0,			// ms

	enegyBallList:{},
	bulletCount:0,
	bulletList:{},
	deleteBulletList:[],


	init:function(){
		this.statusMap[StateType.ST_ACCOUNT] = new StateAccount(gameScene);
		this.statusMap[StateType.ST_PLAY] = new StatePlay(gameScene);
		this.statusMap[StateType.ST_OVER] = new StateOver(gameScene);
		this.changeState(StateType.ST_ACCOUNT);
		NetWork.init();
	},

	reset:function(){
		for(var id in this.playerList){
			this.playerList[id].onDestroy();
			this.playerList[id] = undefined;
		}
	},

	changeState:function(st){
		if (st >= StateType.ST_ACCOUNT && st <= StateType.ST_OVER && st != this.state){
			if (this.state != 0)
				this.statusMap[this.state].onExit();
			this.state = st;
			this.statusMap[this.state].onEnter();
		}
	},

	createWorld:function(args){

	},

	addPlayer:function(id, name, tp, x, y, color){
		if(this.playerList[id] == undefined){
			var player = new Player(id, name, tp, color);
			this.playerList[id] = player;
			this.playerCount ++;
			player.setPosition(x, y);
			player.onCreate();
			//cc.log('add player: ' + name);
			return player;
		}
		else{
			var player = this.playerList[id];
			player.setPosition(x, y);
		}
		return null;
	},

	removePlayer:function(id){
		var player = this.playerList[id];
		if (player instanceof Player){
			this.deletePlayerList[id] = player;
			delete this.playerList[id];
			this.playerCount --;
		}
	},

	getPlayer:function(id){
		return this.playerList[id];
	},

	updateWorld:function(dt){
		if(this.state === StateType.ST_PLAY){
			for(var id in this.playerList){
				this.playerList[id].onUpdate(dt);
			}
			for(var bid in this.bulletList){
				this.bulletList[bid].onUpdate(dt);
			}
		}
		for(var id in this.deletePlayerList){
			this.deletePlayerList[id].onDestroy();
			delete this.deletePlayerList[id];
		}
		if(this.myPlayerInst != null) {
			Game.lookAtPlayer(this.myPlayerInst);
		}

		for(bid in this.bulletList){
			if(this.bulletList[bid].isDead)
				this.deleteBulletList.push(bid);
		}
		if(this.deleteBulletList.length > 0){
			for(bid in this.deleteBulletList){
				this.removeBullet(this.deleteBulletList[bid]);
			}
			this.deleteBulletList.length = 0;
		}

		this._updateState(dt);
	},

	_updateState:function(dt){
		this.statusMap[this.state].onUpdate(dt);
	},

	lookAtPlayer:function(playerInst){
		var wl = gameScene.getWorldLayer();
		var dx = cc.winSize.width * 0.5 - playerInst.getPositionX()*Setting.worldSizeRatio;
		var dy = cc.winSize.height * 0.5 - playerInst.getPositionY()*Setting.worldSizeRatio;
		wl.setPosition(dx, dy);
	},

	// get 'real' time on server now
	calServerTimeNow:function(){
		var localDate = new Date();
		return Game.serverTime + (localDate.getTime() - Game.pingTime);
	},

	addEnegyBall:function(id, x, y, enegy){
		if(this.enegyBallList[id] == undefined){
			var inst = new EnegyBall(id, enegy);
			this.enegyBallList[id] = inst;
			inst.setPosition(x, y);
			inst.onCreate();
			return inst;
		}
		else{
			inst = this.enegyBallList[id];
			inst.setPosition(x, y);
			inst.setEnegy(enegy);
		}
	},

	removeEnegyBall:function(id){
		var inst = this.enegyBallList[id];
		if (inst instanceof EnegyBall){
			inst.onDestroy();
			delete this.enegyBallList[id];
		}
	},

	getEnegyBall:function(id){
		return this.enegyBallList[id];
	},

	getNearbyEnegyBall:function(x, y, radius){
		var ballIds = [];
		for(var id in this.enegyBallList){
			var ball = this.enegyBallList[id];
			var dx = Math.abs(ball.getPositionX() - x);
			var dy = Math.abs(ball.getPositionY() - y);
			if (dx < radius && dy < radius) {
				ballIds.push(id);
			}
		}
		return ballIds;
	},

	addBullet:function(bulletId,playerId,level,timeStamp,x,y,vx,vy){
		if(this.bulletList[bulletId] == undefined){
			var inst = new Bullet(bulletId,level,timeStamp);
			this.bulletList[bulletId] = inst;
			this.bulletCount ++;
			inst.setPosition(x, y);
			inst.setVelocity(vx, vy);
			inst.setForce(vx, vy);
			inst.onCreate();
			return inst;
		}
		else{
			inst = this.bulletList[bulletId];
			inst.setPosition(x, y);
			inst.setVelocity(vx, vy);
			return inst;
		}
	},

	removeBullet:function(id){
		var inst = this.bulletList[id];
		if (inst instanceof Bullet){
			inst.onDestroy();
			delete this.bulletList[id];
			this.bulletCount --;
		}
	},

	getBullet:function(id){
		return this.bulletList[id];
	}

};