


var Player = BaseObj.extend({

	id:0,
	name:"no name",
	type:0,
	radius:20,

	isLocalPlayer:false,

	level:1,
	enegy:0,
	maxEnegy:100,

	needSyncDirection:false,
	targetDirX:0,
	targetDirY:0,

	ctor:function(id, name, type, color){
		this._super();
		this.id = id;
		this.name = name;
		this.type = type;

		this.radius = 30;
		var segment = this.radius*3;

		//var sprite = new cc.Sprite(res.dot_png);
		//this.avatarBody.addChild(sprite, 0);

		var nameLabel = new cc.LabelTTF(this.name, "Arial", 14);
		nameLabel.setColor(cc.color(255, 255, 255, 255));
		nameLabel.setPositionY(this.radius + 5);
		this.avatarRoot.addChild(nameLabel, 5);

		var colorRgb = io.commonColors[color];
		var bodyColor = cc.color(colorRgb[0], colorRgb[1], colorRgb[2], 255);
		var lineWidth = 2;

		var draw = new cc.DrawNode();
		//draw.drawDot(cc.p(0,0), this.radius, bodyColor);
		draw.drawCircle(cc.p(0, 0), this.radius, 0, segment, false, lineWidth, bodyColor);
		this.avatarBody.addChild(draw, 0);

		var sawlen = this.radius * 3;
		var sawwidth = this.radius * 0.3;
		draw.drawRect(cc.p(this.radius,-sawwidth), cc.p(sawlen,sawwidth), cc.color(0,0,0,0), lineWidth, bodyColor);

	},

	// overrides

	onCreate:function(){
		this._super();
	},

	onDestroy:function(){
		this._super();
	},

	onUpdate:function(dt){
		this._super(dt);
		this._updateRotate(dt);
		this._checkEatEnegyBall();
	},

	setRotation:function(angle){
		if(this.avatarBody != null)
			this.avatarBody.setRotation(angle);
	},

	setForce:function(fx, fy){
		this._super(fx, fy);
		var radians = -Math.atan2(fy, fx);
		var degree = 180 * radians / io.PI;
		this.setRotation(degree);
	},

	// private
	_updateRotate:function(dt){
		if(this.needSyncDirection){
			this.needSyncDirection = false;
			// send to server
			MsgSender.move(this.targetDirX,this.targetDirY,this.x,this.y,this.vx,this.vy);
		}
	},

	setTargetDirection:function(dirx, diry){
		if(this.targetDirX != dirx || this.targetDirY != diry){
			this.needSyncDirection = true;
			this.targetDirX = dirx;
			this.targetDirY = diry;
		}
	},

	_checkEatEnegyBall:function(){
		var ballIds = Game.getNearbyEnegyBall(this.x, this.y, 0.3);
		for(var id in ballIds){
			MsgSender.eatEnegyBall(ballIds[id]);
		}
		//cc.log('send eat ' + ballIds.toString());
	}

});