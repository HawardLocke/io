
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

	playerList:{},
	deletePlayerList:{},
	myPlayerGuid:0,
	myPlayerInst:null,

	localDate:null,
	serverTime:0,		// ms
	networkDelayTime:0,	// ms
	pingTime:0,			// ms


	init:function(){
		this.localDate = new Date();
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
			player.setPosition(x, y);
			player.onCreate();
			cc.log('add player: ' + name);
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
		}
		for(var id in this.deletePlayerList){
			this.deletePlayerList[id].onDestroy();
			delete this.deletePlayerList[id];
		}
		if(this.myPlayerInst != null) {
			Game.lookAtPlayer(this.myPlayerInst);
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
		return Game.serverTime + (this.localDate.getTime() - Game.pingTime);
	}

};