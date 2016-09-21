

var BaseObj = cc.Class.extend({

	avatarRoot:null,
	avatarBody:null,
	avatarEffect:null,
	x:0,
	y:0,

	ctor:function(){
		this.avatarRoot = new cc.Node;
		this.avatarRoot.setVisible(false);
		gameScene.addChild(this.avatarRoot, ZORDER.entityZOrder);
		this.avatarBody = new cc.Node;
		this.avatarRoot.addChild(this.avatarBody, 0);
		this.avatarEffect = new cc.Node;
		this.avatarRoot.addChild(this.avatarEffect, 1);
	},

	setPosition:function(x,y){
		this.x = x;this.y = y;
		this.avatarRoot.setPosition(x,y);
	},

	onCreate:function(){
		this.avatarRoot.setVisible(true);
	},

	onDestroy:function(){

	},

	onMove:function(){

	},

	onBreak:function(){

	},


});


var Player = BaseObj.extend({

	id:0,
	name:"no name",
	type:0,

	ctor:function(id, name, type){
		this._super();
		this.id = id;
		this.name = name;
		this.type = type;
		var sprite = new cc.Sprite(res.dot_png);
		this.avatarBody.addChild(sprite, 0);
	},

	onCreate:function(){
		this._super();
	},

	onDestroy:function(){
		this._super();
	},

	onMove:function(){
		this._super();
	},

	onBreak:function(){
		this._super();
	},

});