

class MsgSender:

	game = None

	def __init__(self, _game):
		MsgSender.game = _game

	@staticmethod
	def send_to(player, *args):
		MsgSender.game.send_personal(player.ws, *args)

	@staticmethod
	def send_to_nearby(*args):
		MsgSender.game.send_all(*args)

	@staticmethod
	def send_to_all(*args):
		MsgSender.game.send_all(*args)

