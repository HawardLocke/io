

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

	onEnter:function(){
		this._super();

		var size = cc.winSize;
		var helloLabel = new cc.LabelTTF("what we don't know", "Arial", 14);
		helloLabel.x = size.width / 2;
		helloLabel.y = size.height / 2 + 200;
		this.node.addChild(helloLabel, 5);

		MsgSender.join();
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