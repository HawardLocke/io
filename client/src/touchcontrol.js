
var TouchControl = {

	keyStatus:{
		'left':false,
		'right':false,
		'up':false,
		'down':false
	},

	init:function(){

	},

	onKeyPressed:function(keyCode){
		if (Game.state != StateType.ST_PLAY)
			return;

		var newMoveKey = false;
		if((keyCode == 87 || keyCode == 38) && !this.keyStatus['up']){
			this.keyStatus['up'] = true;
			newMoveKey = true;
		}
		if((keyCode == 83 || keyCode == 40) && !this.keyStatus['down']) {
			this.keyStatus['down'] = true;
			newMoveKey = true;
		}
		if((keyCode == 65 || keyCode == 37) && !this.keyStatus['left']) {
			this.keyStatus['left'] = true;
			newMoveKey = true;
		}
		if((keyCode == 68 || keyCode == 39) && !this.keyStatus['right']) {
			this.keyStatus['right'] = true;
			newMoveKey = true;
		}
		// if keyboard's state changes, recaculate moving direction.
		if(newMoveKey){
			var x = 0; var y = 0;
			x += this.keyStatus['left'] ? -1 : 1;
			x += this.keyStatus['right'] ? 1 : -1;
			y += this.keyStatus['up'] ? 1 : -1;
			y += this.keyStatus['down'] ? -1 : 1;
			MsgSender.move(x,y);

			Game.myPlayerInst.setForce(x, y);
		}
	},

	onKeyReleased:function(keyCode){
		if (Game.state != StateType.ST_PLAY)
			return;
		var newMoveKey = false;
		if((keyCode == 87 || keyCode == 38)){
			this.keyStatus['up'] = false;
			newMoveKey = true;
		}
		if((keyCode == 83 || keyCode == 40)) {
			this.keyStatus['down'] = false;
			newMoveKey = true;
		}
		if((keyCode == 65 || keyCode == 37)) {
			this.keyStatus['left'] = false;
			newMoveKey = true;
		}
		if((keyCode == 68 || keyCode == 39)) {
			this.keyStatus['right'] = false;
			newMoveKey = true;
		}
		// if keyboard's state changes, recaculate moving direction.
		if(newMoveKey){
			var x = 0; var y = 0;
			x += this.keyStatus['left'] ? -1 : 1;
			x += this.keyStatus['right'] ? 1 : -1;
			y += this.keyStatus['up'] ? 1 : -1;
			y += this.keyStatus['down'] ? -1 : 1;
			MsgSender.move(x,y);

			Game.myPlayerInst.setForce(x, y);
		}
	}
};