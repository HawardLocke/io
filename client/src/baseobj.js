

var BaseObj = cc.Class.extend({

	avatarRoot:null,
	avatarBody:null,
	avatarEffect:null,
	x:0,
	y:0,
	vx:0,
	vy:0,
	forcex:0,
	forcey:0,
	max_speed:1,

	ctor:function(){
		this.avatarRoot = new cc.Node;
		this.avatarRoot.setVisible(false);
		gameScene.getWorldLayer().addChild(this.avatarRoot, ZORDER.entityZOrder);
		this.avatarBody = new cc.Node;
		this.avatarRoot.addChild(this.avatarBody, 0);
		this.avatarEffect = new cc.Node;
		this.avatarRoot.addChild(this.avatarEffect, 1);
	},

	setPosition:function(x,y){
		this.x = x;this.y = y;
		if(this.avatarRoot != null)
			this.avatarRoot.setPosition(x*Setting.worldSizeRatio,y*Setting.worldSizeRatio);
	},

	getPositionX:function(){return this.x;},
	getPositionY:function(){return this.y;},

	setRotation:function(angle){
		if(this.avatarRoot != null)
			this.avatarRoot.setRotation(angle);
	},

	setVelocity:function(x, y){
		this.vx = x;
		this.vy = y;
	},

	getVelocityX:function(){return this.vx;},
	getVelocityY:function(){return this.vy;},

	setForce:function(fx, fy){
		this.forcex = fx;
		this.forcey = fy;
	},

	getForceX:function(){return this.forcex;},
	getForceY:function(){return this.forcey;},

	onCreate:function(){
		this.avatarRoot.setVisible(true);
	},

	onDestroy:function(){
		this.avatarRoot.removeFromParent();
		this.avatarRoot = null;
	},

	onUpdate:function(dt) {
		this.updatePosition(dt);
	},

	updatePosition:function(dt){
		if (this.forcex != 0) {
			this.vx += this.forcex * Setting.acc_control * dt;
			if (Math.abs(this.vx) > this.max_speed) {
				if (this.vx > 0)
					this.vx = this.max_speed;
				else
					this.vx = -this.max_speed;
			}
		}
		if (this.forcey != 0) {
			this.vy += this.forcey * Setting.acc_control * dt;
			if (Math.abs(this.vy) > this.max_speed) {
				if (this.vy > 0)
					this.vy = this.max_speed;
				else
					this.vy = -this.max_speed;
			}
		}

		if (this.forcex == 0) {
			if (this.vx > 0) {
				this.vx -= Setting.acc_friction * dt;
				if (this.vx <= 0)
					this.vx = 0;
			}
			if (this.vx < 0) {
				this.vx += Setting.acc_friction * dt;
				if (this.vx >= 0)
					this.vx = 0;
			}
		}
		if (this.forcey == 0) {
			if (this.vy > 0) {
				this.vy -= Setting.acc_friction * dt;
				if (this.vy <= 0)
					this.vy = 0;
			}
			if (this.vy < 0) {
				this.vy += Setting.acc_friction * dt;
				if (this.vy >= 0)
					this.vy = 0;
			}
		}

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


io.commonColors = [
	[199,21,133],
	[148,0,211],
	[30,144,255],
	[0,0,205],
	[0,191,255],
	[0,250,154],
	[34,139,34],
	[255,165,0],
	[255,69,0],

	[199,21,133],
	[0,250,154],
	[255,69,0],
];
