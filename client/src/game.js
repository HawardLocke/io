

var Game = {

	gameScene:null,
	worldSizeRatio:100,

	playerList:{},
	myPlayerGuid:0,
	myPlayerInst:null,

	ctor:function(){

	},

	reset:function(){
		for(var id in this.playerList){
			this.playerList[id].onDestroy();
			this.playerList[id] = undefined;
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