

var ZORDER = {
	bgZOrder : 1,
	entityZOrder : 10,
	uiZOrder : 100,
};


var WorldBGLayer = cc.Layer.extend({

	tileW:256,
	tileH:256,

	tileRoot:null,
	tiles:null,

	ctor:function () {
		this._super();

		var size = cc.winSize;
		var helloLabel = new cc.LabelTTF("(half,half)", "Arial", 14);
		helloLabel.x = size.width / 2;
		helloLabel.y = size.height / 2;
		this.addChild(helloLabel, 5);
		helloLabel = new cc.LabelTTF("(0,0)", "Arial", 14);
		helloLabel.x = 0;
		helloLabel.y = 0;
		this.addChild(helloLabel, 5);

		this.tileRoot = new cc.Node;
		this.addChild(this.tileRoot, 0);

		var numx = Math.ceil(size.width / this.tileW) + 2;
		var numy = Math.ceil(size.height / this.tileH) + 2;

		this.tiles = [];
		for(var x = 0; x < numx; x++){
			this.tiles[x] = [];
			for(var y = 0; y < numy; y++){
				var sprite = new cc.Sprite(res.tile_bg);
				sprite.attr({
					x: this.tileW * (x - 0.5),
					y: this.tileH * (y - 0.5)
				});
				this.tiles[x][y] = sprite;
				this.tileRoot.addChild(sprite, 0);
			}
		}
		return true;
	},

	setPosition:function(x, y){
		this.setPositionX(x);
		this.setPositionY(y);
		var tilex = x % this.tileW;
		var tiley = y % this.tileH;
		this.tileRoot.setPositionX(tilex - this.getPositionX());
		this.tileRoot.setPositionY(tiley - this.getPositionY());
	}
});


var GameScene = cc.Scene.extend({

	worldLayer:null,

	onEnter:function () {
		this._super();
		cc.eventManager.addListener({
			event:cc.EventListener.KEYBOARD,
			onKeyPressed:this.onKeyPressed,
			onKeyReleased:this.onKeyReleased
		},this);
		this.worldLayer = new WorldBGLayer;
		this.worldLayer.setVisible(false);
		this.addChild(this.worldLayer);
	},
	onExit: function () {
		this._super();
		cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
	},
	onKeyPressed:function (keyCode, event) {
		TouchControl.onKeyPressed(keyCode);
	},
	onKeyReleased:function (keyCode, event) {
		TouchControl.onKeyReleased(keyCode);
	},
	getWorldLayer:function(){
		return this.worldLayer;
	}
});