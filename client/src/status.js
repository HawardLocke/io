
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
	}
});

var StateAccount = StateBase.extend({

	waitingForServer:false,

	accountUI:null,
	startBtn:null,
	nameInput:null,
	codeInput:null,


	ctor:function(scene){
		this._super(scene);
		NetWork.registHandler(MsgType.scNewPlayer, this.onStart);
	},

	onEnter:function(){
		cc.log("enter account");
		this._super();
		this.waitingForServer = false;
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

	onExit:function(){
		this._super();
	},

	onUpdate:function(){
		this._super();
	},

	OnStartButtonTouch:function(sender, type) {
		if (this.waitingForServer)
			return;
		switch (type) {
			case ccui.Widget.TOUCH_ENDED:
				this.askStart();
				break;
		}
	},

	askStart:function(){
		cc.log("start");
		var name = this.nameInput.getString();
		var seed = this.codeInput.getString();
		this.waitingForServer = true;
		NetWork.sendMessage([MsgType.csNewPlayer, name, seed]);
	},

	onStart:function(args){
		// to play and create the world.
		this.waitingForServer = false;
		var name = args[1];
		var guid = args[2];
		cc.log("on start, name " + name + ", guid " + guid);
		Game.myPlayerGuid = guid;
		gameScene.changeState(StateType.ST_PLAY);
	}

});

var StatePlay = StateBase.extend({

	ctor:function(scene){
		this._super(scene);
		NetWork.registHandler(MsgType.scJoined, this.onPlayerJoin);
		NetWork.registHandler(MsgType.scTransform, this.onPlayerTransform);
	},

	onEnter:function(){
		cc.log("enter play");
		this._super();
		NetWork.sendMessage([MsgType.csJoin]);
		var size = cc.winSize;
		var helloLabel = new cc.LabelTTF("what we don't know", "Arial", 14);
		helloLabel.x = size.width / 2;
		helloLabel.y = size.height / 2 + 200;
		this.node.addChild(helloLabel, 5);
	},
	onExit:function(){
		this._super();
	},
	onUpdate:function(){
		this._super();
	},

	onPlayerJoin:function(args){
		cc.log("on join: " + args);
		var guid = args[1];
		var name = args[2];
		var tp = args[3];
		var x = args[4]*Game.worldSizeRatio;
		var y = args[5]*Game.worldSizeRatio;
		var playerInst = Game.addPlayer(guid, name, tp, x, y);
		if (Game.myPlayerGuid === guid){
			Game.myPlayerInst = playerInst;
		}
	},

	onPlayerTransform:function(args){
		cc.log("on trans: " + args);
		var guid = args[1];
		var x = args[2]*Game.worldSizeRatio;
		var y = args[3]*Game.worldSizeRatio;
		var playerInst = Game.getPlayer(guid);
		if (playerInst instanceof Player){
			playerInst.setPosition(x, y);
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