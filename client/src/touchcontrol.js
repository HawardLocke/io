
var TouchControl = {

	onKeyPressed:function(keyCode){
		if (Game.state != StateType.ST_PLAY)
			return;
		var x = 0;var y = 0;
		if(keyCode == 87 || keyCode == 38)y += 1;
		if(keyCode == 83 || keyCode == 40)y += -1;
		if(keyCode == 65 || keyCode == 37)x += -1;
		if(keyCode == 68 || keyCode == 39)x += 1;
		if(x != 0 || y != 0){
			MsgSender.move(x,y);
		}
	},

	onKeyReleased:function(keyCode){
		if (Game.state != StateType.ST_PLAY)
			return;
		MsgSender.move(0,0);
	}
};