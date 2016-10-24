

var Bullet = BaseObj.extend({

	ownerGuid:0,
	level:1,
	spawnTime:0,

	speed:0,
	maxPersistTime:1,	// seconds
	isDead:false,
	isHit:false,

	ctor:function(id, level, timeStamp, vx, vy){
		this._super();
		this.id = id;
		this.level = level;
		this.spawnTime = timeStamp;

		this.speed = (new cc.math.Vec2(vx,vy)).length();
		this.maxPersistTime = this.getShootDistance() / this.speed;

		var draw = new cc.DrawNode();
		draw.drawDot(cc.p(0,0), 4, cc.color(255,255,255,255));
		var segLen = 15;
		draw.drawSegment(cc.p(0,0), cc.p(0,-segLen), 3, cc.color(255,255,0,255));
		draw.drawSegment(cc.p(0,-segLen), cc.p(0,-segLen*2), 2, cc.color(255,128,0,255));
		draw.drawSegment(cc.p(0,-segLen*2), cc.p(0,-segLen*3), 1, cc.color(255,70,0,200));
		this.avatarBody.addChild(draw, 0);

		// rotate
		var radians = Math.atan2(vx, vy);
		var degree = 180 * radians / io.PI;
		this.setRotation(degree);
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
		var oldx = this.x;
		var oldy = this.y;
		this.setPosition(this.x, this.y);

		// check disappear.
		if (!this.isDead){
			var curTime = Game.calServerTimeNow();
			if (curTime > this.spawnTime + this.maxPersistTime * 1000){
				this.isDead = true;
				//cc.log('is dead, ' + curTime + ', ' + this.spawnTime + ', ' + this.maxPersistTime * 1000 )
			}
		}

		// check hit
		if (this.ownerGuid == Game.myPlayerGuid && !this.isDead && !this.isHit){
			// oldx oldy x y
			var dx = this.x - oldx;
			var dy = this.y - oldy;
			var distDT = this.speed * dt;
			var segment = Math.ceil(distDT / Setting.minPlayerSize / 2);
			for(var sg = 1; sg <= segment; sg++){
				var sgx = oldx + dx * (sg/segment);
				var sgy = oldy + dy * (sg/segment);
				var playerHit = Game.tryGetHitPlayer(sgx,sgy);
				if(playerHit != null){
					this.isHit = true;
					this.isDead = true;
					this.setVelocity(0,0);
					MsgSender.hitPlayer(this.id, playerHit.id);
					cc.log('bullet hit player...');
					break;
				}
			}
		}

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

