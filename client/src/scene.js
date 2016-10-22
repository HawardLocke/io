

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
	drawNode:null,

	ctor:function () {
		this._super();

		var size = cc.winSize;

		this.drawNode = new cc.DrawNode();
		this.addChild(this.drawNode, 5);

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

	RefreshWorldInfo:function(){
		var width = Game.worldWidth * Setting.worldSizeRatio;
		var height = Game.worldHeight * Setting.worldSizeRatio;
		this.drawNode.drawDot(cc.p(width/2,height/2), 10, cc.color(255,0,0,255));
		this.drawNode.drawRect(cc.p(0,0), cc.p(width,height), cc.color(0,0,0,0), 3, cc.color(255,0,0,255));
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
		this.scheduleUpdate();
		cc.eventManager.addListener({
			event:cc.EventListener.KEYBOARD,
			onKeyPressed:this.onKeyPressed,
			onKeyReleased:this.onKeyReleased
		},this);
		cc.eventManager.addListener({
			event:cc.EventListener.MOUSE,
			onMouseMove:this.onMouseMove,
			onMouseUp:this.onMouseUp,
			onMouseDown:this.onMouseDown,
			onMouseScroll:this.onMouseScroll
		},this);
		this.worldLayer = new WorldBGLayer;
		this.worldLayer.setVisible(false);
		this.addChild(this.worldLayer);
	},
	onExit: function () {
		this._super();
		this.unscheduleUpdate();
		cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
	},
	onKeyPressed:function (keyCode, event) {
		TouchControl.onKeyPressed(keyCode);
	},
	onKeyReleased:function (keyCode, event) {
		TouchControl.onKeyReleased(keyCode);
	},
	onMouseMove:function(event){
		//var str = "MousePosition X: " + event.getLocationX() + "  Y:" + event.getLocationY();
		TouchControl.onMouseMove(event.getLocationX(), event.getLocationY());
	},
	onMouseUp:function(event){
		//var str = "Mouse Up detected, Key: " + event.getButton();
		TouchControl.onMouseUp(event.getLocationX(), event.getLocationY());
	},
	onMouseDown:function(event){
		//var str = "Mouse Down detected, Key: " + event.getButton();
	},
	onMouseScroll:function(event){
		//var str = "Mouse Scroll detected, X: " + event.getLocationX() + "  Y:" + event.getLocationY();
	},
	getWorldLayer:function(){
		return this.worldLayer;
	},
	update:function(dt){
		this._super(dt);
		Game.updateWorld(dt);
	}
});