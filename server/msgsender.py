
import struct

from datatypes import MsgType


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

	@staticmethod
	def send_error(player, error_desc):
		fmt = 'H%ds' % len(error_desc)
		data = struct.pack(fmt, MsgType.scError, error_desc)
		player.ws.send_bytes(data)

	@staticmethod
	def send_newplayer(player, name, guid):
		fmt = 'H%ds%ds' % len(name)
		data = struct.pack(fmt, MsgType.scNewPlayer, error_desc)
		player.ws.send_bytes(data)

