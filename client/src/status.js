

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

	delayLabel:null,
	forceLabel:null,
	speedLabel:null,

	onEnter:function(){
		this._super();

		gameScene.getWorldLayer().setVisible(true);

		var size = cc.winSize;
		this.delayLabel = new cc.LabelTTF("delay:--", "Arial", 14);
		this.delayLabel.x = size.width - 100;
		this.delayLabel.y = 20;
		this.node.addChild(this.delayLabel, 5);

		this.forceLabel = new cc.LabelTTF("force:--", "Arial", 14);
		this.forceLabel.x = size.width - 100;
		this.forceLabel.y = 40;
		this.node.addChild(this.forceLabel, 5);

		this.speedLabel = new cc.LabelTTF("speed:--", "Arial", 14);
		this.speedLabel.x = size.width - 100;
		this.speedLabel.y = 60;
		this.node.addChild(this.speedLabel, 5);

		MsgSender.join();
	},

	onExit:function(){
		gameScene.getWorldLayer().setVisible(false);
	},

	onUpdate:function(dt){
		this.delayLabel.setString("delay : " + Math.floor(Game.networkDelayTime+0.5) + " ms");

		if(Game.myPlayerInst != null)
		{
			this.forceLabel.setString("force : "
				+ Game.myPlayerInst.getForceX().toFixed(2) + ", " + Game.myPlayerInst.getForceY().toFixed(2));
			this.speedLabel.setString("speed : "
				+ Game.myPlayerInst.getVelocityX().toFixed(2) + ", " + Game.myPlayerInst.getVelocityY().toFixed(2));
		}
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