

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

	// labels of system
	sysRootNode:null,
	labelCount:0,
	delayLabel:null,
	forceLabel:null,
	speedLabel:null,
	serverTimeLabel:null,
	bulletsLabel:null,
	playersLabel:null,

	// minimap
	minmap:null,

	// rank
	rankRootNode:null,
	rankCount:10,
	rankIndexLabels:[],
	rankNameLabels:[],
	rankScoreLabels:[],


	onEnter:function(){
		this._super();

		gameScene.getWorldLayer().setVisible(true);

		// system
		this.sysRootNode = new cc.Node();
		this.sysRootNode.x = 0;
		this.sysRootNode.y = 0;
		this.node.addChild(this.sysRootNode, 5);

		this.delayLabel = this.appendSysLabel();
		this.forceLabel = this.appendSysLabel();
		this.speedLabel = this.appendSysLabel();
		this.serverTimeLabel = this.appendSysLabel();
		this.bulletsLabel = this.appendSysLabel();
		this.playersLabel = this.appendSysLabel();

		// minimap
		this.minmap = new cc.DrawNode();
		this.minmap.x = cc.winSize.width - 110;
		this.minmap.y = cc.winSize.height - 110;
		this.node.addChild(this.minmap, 5);

		// rank
		this.rankRootNode = new cc.Node();
		this.rankRootNode.x = 0;
		this.rankRootNode.y = -20;
		this.node.addChild(this.rankRootNode, 5);
		var leaderBoard = new cc.LabelTTF("LeaderBoard", "Arial", 24, cc.size(200,36), cc.TEXT_ALIGNMENT_CENTER);
		leaderBoard.x = 120;
		leaderBoard.y = cc.winSize.height;
		leaderBoard.color = cc.color(0,255,255,255);
		this.rankRootNode.addChild(leaderBoard);
		for(var rk = 0; rk < this.rankCount; ++rk){
			this.rankIndexLabels[rk] = this.appendRankIndexLabel(rk);
			this.rankNameLabels[rk] = this.appendRankNameLabel(rk);
			this.rankScoreLabels[rk] = this.appendRankScoreLabel(rk);
		}

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
				this.minmap.drawDot(cc.p(x, y), 3, myPlayerColor);
			else
				this.minmap.drawDot(cc.p(x, y), 3, otherPlayerColor);
		}
		for(id in Game.enegyBallList){
			var enegy = Game.enegyBallList[id];
			x = (enegy.getPositionX() - 0.5*Game.worldWidth) * minmapScale;
			y = (enegy.getPositionY() - 0.5*Game.worldHeight) * minmapScale;
			this.minmap.drawDot(cc.p(x, y), 1, cc.color(255, 255, 0, 255));
		}
	},

	appendSysLabel:function(){
		var lineHeight = 20;
		this.labelCount ++;
		var label = new cc.LabelTTF("new label", "Arial", 14);
		label.x = cc.winSize.width - 100;
		label.y = lineHeight * this.labelCount;
		label.color = cc.color(0,255,0,255);
		this.sysRootNode.addChild(label);
		return label;
	},

	appendRankIndexLabel:function(index){
		var lineHeight = 24;
		var label = new cc.LabelTTF("#"+(index+1), "Arial", 18, cc.size(40,32), cc.TEXT_ALIGNMENT_CENTER);
		label.x = 20;
		label.y = cc.winSize.height - lineHeight * (index+1);
		label.color = cc.color(io.commonColors[index][0],io.commonColors[index][1],io.commonColors[index][2]);//cc.color(0,255,255,255);
		this.rankRootNode.addChild(label);
		return label;
	},

	appendRankNameLabel:function(index){
		var lineHeight = 24;
		var label = new cc.LabelTTF("Locke00"+index, "Arial", 18, cc.size(200,32), cc.TEXT_ALIGNMENT_CENTER);
		label.x = 110;
		label.y = cc.winSize.height - lineHeight * (index+1);
		label.color = cc.color(io.commonColors[index][0],io.commonColors[index][1],io.commonColors[index][2]);
		this.rankRootNode.addChild(label);
		return label;
	},

	appendRankScoreLabel:function(index){
		var lineHeight = 24;
		var label = new cc.LabelTTF("3695"+index, "Arial", 18, cc.size(100,32), cc.TEXT_ALIGNMENT_LEFT);
		label.x = 250;
		label.y = cc.winSize.height - lineHeight * (index+1);
		label.color = cc.color(io.commonColors[index][0],io.commonColors[index][1],io.commonColors[index][2]);
		this.rankRootNode.addChild(label);
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