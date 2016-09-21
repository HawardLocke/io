
var ZORDER = {
	bgZOrder : 1,
	entityZOrder : 10,
	uiZOrder : 100,
};


var GameLayer = cc.Layer.extend({
	sprite:null,

	ctor:function () {
		this._super();

		/*var size = cc.winSize;
		var helloLabel = new cc.LabelTTF("what we don't know", "Arial", 14);
		helloLabel.x = size.width / 2;
		helloLabel.y = size.height / 2 + 200;
		this.addChild(helloLabel, 5);
		this.sprite = new cc.Sprite(res.Splah_png);
		this.sprite.attr({
			x: size.width / 2,
			y: size.height / 2
		});
		this.addChild(this.sprite, 0);*/

		return true;
	}

});

var StateType = {
	ST_ACCOUNT:1,
	ST_PLAY:2,
	ST_OVER:3
};

var GameScene = cc.Scene.extend({

	statusMap:{},
	state:0,

	onEnter:function () {
		this._super();
		cc.eventManager.addListener({
			event:cc.EventListener.KEYBOARD,
			onKeyPressed:this.onKeyPressed,
			onKeyReleased:this.onKeyReleased
		},this);
		this.statusMap[StateType.ST_ACCOUNT] = new StateAccount(this);
		this.statusMap[StateType.ST_PLAY] = new StatePlay(this);
		this.statusMap[StateType.ST_OVER] = new StateOver(this);
		this.changeState(StateType.ST_ACCOUNT);
		NetWork.init();
	},

	onExit: function () {
		this._super();
		cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
	},

	changeState:function(st){
		if (st >= StateType.ST_ACCOUNT && st <= StateType.ST_OVER && st != this.state){
			if (this.state != 0)
				this.statusMap[this.state].onExit();
			this.state = st;
			this.statusMap[this.state].onEnter();
		}
	},

	onKeyPressed:function (keyCode, event) {
		if (this.state != this.ST_PLAY)
			return;
		var x = 0;var y = 0;
		if(keyCode == 87 || keyCode == 38)y += 1;
		if(keyCode == 83 || keyCode == 40)y += -1;
		if(keyCode == 65 || keyCode == 37)x += -1;
		if(keyCode == 68 || keyCode == 39)x += 1;
		if(x != 0 || y != 0){NetWork.sendMessage([MsgType.csMove,x,y]);}
	},

	onKeyReleased:function (keyCode, event) {
		if (this.state != this.ST_PLAY)
			return;
		NetWork.sendMessage([MsgType.csMove,0,0]);
	},

});

