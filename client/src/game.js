

var Game = {

	gameScene:null,

	playerList:{},

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

	addPlayer:function(dataArray){
		var id = dataArray[0];
		var name = dataArray[1];
		var type = dataArray[2];
		if(this.playerList[id] == undefined){
			this.playerList[id] = new Player(id, name, type);
		}
	},

	removePlayer:function(id){
		var player = this.playerList[id];
		if (player instanceof Player){
			this.playerList[id] = undefined;
			player.onDestroy();
		}
	},

	updateEntity:function(dataArray){

	}

};