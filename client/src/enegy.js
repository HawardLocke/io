

var Enegy = BaseObj.extend({

	enegy:0,

	ctor:function(id, enegy){
		this._super();
		this.id = id;
		this.enegy = enegy;

		var draw = new cc.DrawNode();
		draw.drawDot(cc.p(0,0), enegy, cc.color(255,255,0,255));
		this.avatarBody.addChild(draw, 0);
	},

	setEnegy:function(enegy){
		this.enegy = enegy;
	}

});