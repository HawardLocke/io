

var StateBase = cc.Class.extend({
	scene:null,
	node:null,
	ctor:function(scene){
		this.scene = scene;
		this.node = new cc.Node();
		this.scene.addChild(this.node, ZORDER.uiZOrder);
	},
	onEnter:function(){
		if(this.node != null){
			this.node.setVisible(true);
		}
	},
	onExit:function(){
		if(this.node != null){
			this.node.setVisible(false);
		}
	},
	onUpdate:function(dt){

	}
});

var StateAccount = StateBase.extend({

	accountUI:null,
	startBtn:null,
	nameInput:null,
	codeInput:null,

	onEnter:function(){
		this._super();

		if (this.accountUI == null){
			var uiroot = ccs.load('res/account.json').node;
			this.node.addChild(uiroot);
			var rootsize = uiroot.getContentSize();
			var x = cc.winSize.width * 0.5 - rootsize.width*0.5;
			var y = cc.winSize.height * 0.5 - rootsize.height*0.5 + 100;
			uiroot.setPosition(x,y);
			this.accountUI = uiroot;

			this.startBtn = ccui.helper.seekWidgetByName(uiroot, "start");
			this.startBtn.addTouchEventListener(this.OnStartButtonTouch, this);
			this.nameInput = ccui.helper.seekWidgetByName(uiroot, "input1");
			this.codeInput = ccui.helper.seekWidgetByName(uiroot, "input2");
			this.nameInput.setString('Locke');
			this.codeInput.setString('******');
		}
	},

	OnStartButtonTouch:function(sender, type) {
		switch (type) {
			case ccui.Widget.TOUCH_ENDED:
				var name = this.nameInput.getString();
				var seed = this.codeInput.getString();
				MsgSender.newPlayer(name, seed);
				break;
		}
	}

});


var StatePlay = StateBase.extend({

	labelCount:0,
	delayLabel:null,
	forceLabel:null,
	speedLabel:null,
	serverTimeLabel:null,
	bulletsLabel:null,
	playersLabel:null,
	minmap:null,

	onEnter:function(){
		this._super();

		gameScene.getWorldLayer().setVisible(true);

		this.delayLabel = this.appendLabel();
		this.forceLabel = this.appendLabel();
		this.speedLabel = this.appendLabel();
		this.serverTimeLabel = this.appendLabel();
		this.bulletsLabel = this.appendLabel();
		this.playersLabel = this.appendLabel();

		this.minmap = new cc.DrawNode();
		this.minmap.x = cc.winSize.width - 110;
		this.minmap.y = cc.winSize.height - 110;
		this.node.addChild(this.minmap, 5);

		MsgSender.join();
	},

	onExit:function(){
		gameScene.getWorldLayer().setVisible(false);
	},

	onUpdate:function(dt){
		this.delayLabel.setString("delay : " + Math.floor(Game.networkDelayTime+0.5) + " ms");
		this.serverTimeLabel.setString("time : " + Math.floor(Game.serverTime/1000) + " s");
		if(Game.myPlayerInst != null)
		{
			this.forceLabel.setString("force : "
				+ Game.myPlayerInst.getForceX().toFixed(2) + ", " + Game.myPlayerInst.getForceY().toFixed(2));
			this.speedLabel.setString("speed : "
				+ Game.myPlayerInst.getVelocityX().toFixed(2) + ", " + Game.myPlayerInst.getVelocityY().toFixed(2));
		}
		this.bulletsLabel.setString("bullets : " + Game.bulletCount);
		this.playersLabel.setString("players : " + Game.playerCount);

		// minmap
		var minmapWidth = 200;
		var minmapScale = minmapWidth / Game.worldWidth;
		var minmapHeight = Game.worldHeight * minmapScale;
		var myPlayerColor = cc.color(255, 0, 0, 255);
		var otherPlayerColor = cc.color(0, 0, 255, 255);
		this.minmap.clear();
		this.minmap.drawRect(cc.p(-0.5*minmapWidth,-0.5*minmapHeight), cc.p(0.5*minmapWidth,0.5*minmapHeight), cc.color(0,255,0,20), 2, cc.color(0, 255, 0, 0));
		for(var id in Game.playerList){
			var player = Game.playerList[id];
			var x = (player.getPositionX() - 0.5*Game.worldWidth) * minmapScale;
			var y = (player.getPositionY() - 0.5*Game.worldHeight) * minmapScale;
			if (player.id == Game.myPlayerGuid)
				this.minmap.drawDot(cc.p(x, y), 4, myPlayerColor);
			else
				this.minmap.drawDot(cc.p(x, y), 4, otherPlayerColor);
		}
		for(id in Game.enegyBallList){
			var enegy = Game.enegyBallList[id];
			x = (enegy.getPositionX() - 0.5*Game.worldWidth) * minmapScale;
			y = (enegy.getPositionY() - 0.5*Game.worldHeight) * minmapScale;
			this.minmap.drawDot(cc.p(x, y), 1, cc.color(0, 255, 0, 255));
		}
	},

	appendLabel:function(){
		var lineHeight = 20;
		this.labelCount ++;
		var label = new cc.LabelTTF("new label", "Arial", 14);
		label.x = cc.winSize.width - 100;
		label.y = lineHeight * this.labelCount;
		this.node.addChild(label, 5);
		return label;
	}

});


var StateOver = StateBase.extend({

	ctor:function(scene){
		this._super(scene);
	},

	onEnter:function(){
		cc.log("enter over");
		this._super();
	},
	onExit:function(){
		this._super();
	},
	onUpdate:function(){
		this._super();
	}
});