
var AccountLayer = cc.Layer.extend({
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
});


var GamePlayLayer = cc.Layer.extend({
    sprite:null,

    ctor:function () {
        this._super();

        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF("game play", "Arial", 14);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 250;
        this.addChild(helloLabel, 5);

        return true;
    }
});


var GameOverLayer = cc.Layer.extend({
    sprite:null,

    ctor:function () {
        this._super();

        var size = cc.winSize;

        var helloLabel = new cc.LabelTTF("game over", "Arial", 14);
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 300;
        this.addChild(helloLabel, 5);

        return true;
    }
});


var StateBase = Class.extend({
    scene:null,
    layer:null,
    ctor:function(scene){
        this.scene = scene;
    },
    onEnter:function(){
        this.layer = null;
    },
    onExit:function(){
        if(this.layer != null){
            this.layer.removeFromParent();
            this.layer = null;
        }
    },
    onUpdate:function(){}
});

var StateAccount = StateBase.extend({

    ctor:function(scene){
        this._super(scene);
    },

    onEnter:function(){
        this._super();
        this.layer = new AccountLayer();
        this.scene.addChild(this.layer);
    },
    onExit:function(){
        this._super();
    },
    onUpdate:function(){
        this._super();
    }
});

var StatePlay = StateBase.extend({

    ctor:function(scene){
        this._super(scene);
    },

    onEnter:function(){
        this._super();
        this.layer = new GamePlayLayer();
        this.scene.addChild(this.layer);
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
        this._super();
        this.layer = new GameOverLayer();
        this.scene.addChild(this.layer);
    },
    onExit:function(){
        this._super();
    },
    onUpdate:function(){
        this._super();
    }
});


var HelloWorldScene = cc.Scene.extend({
    StateAccount:null,
    StatePlay:null,
    StateOver:null,

    // status
    ST_ACCOUNT:1,
    ST_PLAY:2,
    ST_OVER:3,
    state:null,

    onEnter:function () {
        this._super();

        this.StateAccount = new StateAccount(this);
        this.StatePlay = new StatePlay(this);
        this.StateOver = new StateOver(this);

        this.changeState(this.ST_ACCOUNT);
    },

    changeState:function(st){
        var curState = this.state;
        var targetState = this.getState(st);
        if (targetState != null && targetState != this.state){
            if (this.state != null)
                this.state.onExit();
            this.state = targetState;
            this.state.onEnter();
        }
    },

    getState:function(st){
        var targetState = null;
        switch(st){
            case this.ST_ACCOUNT:
                targetState = this.StateAccount;
                break;
            case this.ST_PLAY:
                targetState = this.StatePlay;
                break;
            case this.ST_OVER:
                targetState = this.StateOver;
                break;
        }
        return targetState;
    }

});

