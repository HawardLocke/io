
/*var AccountLayer = cc.Layer.extend({
    sprite:null,

    ctor:function () {
        this._super();

        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF("what we don't know", "Arial", 14);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        this.addChild(helloLabel, 5);

        this.sprite = new cc.Sprite(res.Splah_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        return true;
    }
});*/

var MsgType = {
    // c->s
    csNewPlayer:1001,
    csMove:1002,
    // s->c
    scNewPlayer:2001,
};

var NetWork = {

    websock:null,
    msgHandlers:{},

    init:function(){
        var ws_url = "ws://" + location.host + "/connect";
        this.websock = new WebSocket(ws_url);
        this.websock.onopen = this.openHandler;
        this.websock.onmessage = this.messageHandler;
        this.websock.onerror = function (e) {
            cc.log(e.message);
        };
    },

    openHandler:function(e){
        cc.log("socket open: "+e.message);
        $(document).bind("keydown", keyHandler);
    },

    messageHandler:function(e) {
        json = JSON.parse(e.data);
        if (!(json[0] instanceof Array))
            json = [json];

        for (var i = 0; i < json.length; i++) {
            var args = json[i];
            var cmd = json[i][0];
            var handlers = this.msgHandlers[cmd];
            if (handlers == null){
                for (var h = 0; h < json.length; h++){
                    handlers[h](args);
                }
            }
        }
    },

    sendMessage:function(msgArray) {
        if (this.websock != null && this.websock.readyState == WebSocket.OPEN){
            var msg = JSON.stringify(msgArray);
            this.websock.send(msg);
        }
        else {
            cc.log("sendMessage: socket is closed");
        }
    },

    registHandler:function(msg, handler){
        if (this.msgHandlers[msg] == null){
            this.msgHandlers[msg] = [];
        }
        if (msg != null && handler != null && msg != undefined && handler != undefined && handler instanceof Function){
            var handlerArray = this.msgHandlers[msg];
            handlerArray[handlerArray.length] = handler;
        }
    }
};


function keyHandler(event) {
    var code = event.keyCode;
    if (!code && event.charCode)
        code = event.charCode;

    if (ws && ws.readyState == WebSocket.OPEN) {
        ws.send(code);
        event.preventDefault();
    }
    else {
        cc.log("Connection is closed");
    }
}


// status---------------------------------------------------------------------------

var StateBase = cc.Class.extend({
    scene:null,
    layer:null,
    ctor:function(scene){
        this.scene = scene;
        this.layer = new cc.Layer();
        this.scene.addChild(this.layer);
    },
    onEnter:function(){
        if(this.layer != null){
            this.layer.setVisible(true);
        }
    },
    onExit:function(){
        if(this.layer != null){
            this.layer.setVisible(false);
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
            this.layer.addChild(uiroot);
            var rootsize = uiroot.getContentSize();
            var x = cc.winSize.width * 0.5 - rootsize.width*0.5;
            var y = cc.winSize.height * 0.5 - rootsize.height*0.5 + 100;
            uiroot.setPosition(x,y);
            this.accountUI = uiroot;

            this.startBtn = ccui.helper.seekWidgetByName(root, "startBtn");
            this.startBtn.addTouchEventListener(this.OnStartButtonTouch, this);
            this.nameInput = ccui.helper.seekWidgetByName(root, "name/input");
            this.codeInput = ccui.helper.seekWidgetByName(root, "name/pswd");
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


var GameScene = cc.Scene.extend({
    ST_ACCOUNT:1,
    ST_PLAY:2,
    ST_OVER:3,
    statusMap:{},
    state:0,

    onEnter:function () {
        this._super();
        NetWork.init();
        this.statusMap[this.ST_ACCOUNT] =new StateAccount(this);
        this.statusMap[this.ST_PLAY] =new StatePlay(this);
        this.statusMap[this.ST_OVER] =new StateOver(this);
        this.changeState(this.ST_ACCOUNT);
    },

    changeState:function(st){
        if (st >= this.ST_ACCOUNT && st <= this.ST_OVER && st != this.state){
            if (this.state != 0)
                this.statusMap[this.state].onExit();
            this.state = st;
            this.statusMap[this.state].onEnter();
        }
    },



});

