
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
			this.nameInput.setString('lk');
			this.codeInput.setString('**');
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
		var code = this.codeInput.getString();
		this.waitingForServer = true;
		NetWork.sendMessage([MsgType.csNewPlayer, name, code]);
	},

	onStart:function(args){
		// to play and create the world.
		this.waitingForServer = false;
		cc.log("on start: " + args);
	}

});

var StatePlay = StateBase.extend({

	ctor:function(scene){
		this._super(scene);
	},

	onEnter:function(){
		cc.log("enter play");
		this._super();
	},
	onExit:function(){
		this._super();
	},
	onUpdate:function(){
		this._super();
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