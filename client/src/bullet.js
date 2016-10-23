

var Bullet = BaseObj.extend({

	ownerGuid:0,
	level:1,
	spawnTime:0,

	speed:0,
	maxPersistTime:1,	// seconds
	isDead:false,

	ctor:function(id, level, timeStamp){
		this._super();
		this.id = id;
		this.level = level;
		this.spawnTime = timeStamp;

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

		// check disappear.
		if (!this.isDead){
			var curTime = Game.calServerTimeNow();
			if (curTime > this.spawnTime + this.maxPersistTime * 1000){
				this.isDead = true;
				cc.log('is dead, ' + curTime + ', ' + this.spawnTime + ', ' + this.maxPersistTime * 1000 )
			}
		}

	},

	setVelocity:function(x, y){
		this._super(x, y);
		this.speed = (new cc.math.Vec2(x,y)).length();
		this.maxPersistTime = this.getShootDistance() / this.speed;
		cc.log('persist '+this.maxPersistTime);
	},

	getShootDistance:function(){
		var dist = 1;
		if(this.level == 1)
			dist = 8;
		else if(this.level == 2)
			dist = 9;
		else
			dist = 10;
		return dist;
	}


});

