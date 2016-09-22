
var StateType = {
	ST_ACCOUNT:1,
	ST_PLAY:2,
	ST_OVER:3
};


var Game = {

	statusMap:{},
	state:0,

	gameScene:null,
	worldSizeRatio:100,

	playerList:{},
	myPlayerGuid:0,
	myPlayerInst:null,

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

	addPlayer:function(id, name, tp, x, y){
		if(this.playerList[id] == undefined){
			var player = new Player(id, name, tp);
			this.playerList[id] = player;
			player.setPosition(x, y);
			player.onCreate();
			cc.log('add player: ' + name);
			return player;
		}
		return null;
	},

	removePlayer:function(id){
		var player = this.playerList[id];
		if (player instanceof Player){
			this.playerList[id] = undefined;
			player.onDestroy();
		}
	},

	getPlayer:function(id){
		return this.playerList[id];
	},

	updateEntity:function(dataArray){

	}

};