

var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		cc.eventManager.addListener({
			event:cc.EventListener.KEYBOARD,
			onKeyPressed:this.onKeyPressed,
			onKeyReleased:this.onKeyReleased
		},this);
	},
	onExit: function () {
		this._super();
		cc.eventManager.removeListeners(cc.EventListener.KEYBOARD);
	},
	onKeyPressed:function (keyCode, event) {
		TouchControl.onKeyPressed(keyCode);
	},
	onKeyReleased:function (keyCode, event) {
		TouchControl.onKeyReleased(keyCode);
	}
});