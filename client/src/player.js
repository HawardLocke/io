


var Player = BaseObj.extend({

	id:0,
	name:"no name",
	type:0,
	radius:20,

	ctor:function(id, name, type, color){
		this._super();
		this.id = id;
		this.name = name;
		this.type = type;

		this.radius = 50;
		var segment = this.radius*3;

		//var sprite = new cc.Sprite(res.dot_png);
		//this.avatarBody.addChild(sprite, 0);

		var nameLabel = new cc.LabelTTF(this.name, "Arial", 14);
		nameLabel.setColor(cc.color(255, 255, 255, 255));
		nameLabel.setPositionY(this.radius + 5);
		this.avatarRoot.addChild(nameLabel, 5);

		var bodyColor = cc.color(color[0], color[1], color[2], 255);
		var lineWidth = 2;

		var draw = new cc.DrawNode();
		//draw.drawDot(cc.p(0,0), this.radius, bodyColor);
		draw.drawCircle(cc.p(0, 0), this.radius, 0, segment, false, lineWidth, bodyColor);
		this.avatarBody.addChild(draw, 0);

		var sawlen = this.radius * 3;
		var sawwidth = this.radius * 0.3;
		draw.drawRect(cc.p(this.radius,-sawwidth), cc.p(sawlen,sawwidth), cc.color(0,0,0,0), lineWidth, bodyColor);

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