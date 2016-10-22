

var Bullet = BaseObj.extend({

	ownerGuid:0,
	level:1,
	spawnTime:0,

	ctor:function(id, level){
		this._super();
		this.id = id;
		this.level = level;

		var draw = new cc.DrawNode();
		draw.drawDot(cc.p(0,0), 4, cc.color(255,0,0,255));
		this.avatarBody.addChild(draw, 0);
	},


	// overrides

	onCreate:function(){
		this._super();
	},

	onDestroy:function(){
		this._super();
	},

	onUpdate:function(dt){
		if(this.vx != 0)
			this.x += this.vx * dt;
		if(this.vy != 0)
			this.y += this.vy * dt;
		this.x = Math.min(this.x, Game.worldWidth);
		this.x = Math.max(this.x, 0);
		this.y = Math.min(this.y, Game.worldHeight);
		this.y = Math.max(this.y, 0);

		this.setPosition(this.x, this.y);
	}


});