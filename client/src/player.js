


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
		var nameLabel = new cc.LabelTTF(this.name, "Arial", 14);
		this.avatarBody.addChild(nameLabel, 5);
	},

	onCreate:function(){
		this._super();
	},

	onDestroy:function(){
		this._super();
	},

	onUpdate:function(dt){
		this._super(dt);
	}

});