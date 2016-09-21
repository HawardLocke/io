
# from game import Game
# from player import Player
from datatypes import MsgType


class MsgHandler:

	game = None

	def __init__(self, _game):
		MsgHandler.game = _game
		self.__handlers = {}

	def regist(self, msg, handler):
		self.__handlers[msg] = handler

	def regist_all(self):
		self.regist(MsgType.csNewPlayer, on_newplayer)
		self.regist(MsgType.csJoin, on_join)
		self.regist(MsgType.csMove, on_playermove)

	def on_msg(self, player, ws, data):
		cmd = data
		if type(data) == list:
			cmd = data[0]
		handler = self.__handlers.get(cmd)
		if handler is not None:
			handler(player, ws, data)


def on_newplayer(player, ws, args):
	name = args[1]
	seed = args[2]
	# print("on new player " + name + " " + seed)
	MsgHandler.game.new_player(name, seed, ws)


def on_join(player, ws, args):
	MsgHandler.game.join(player, ws)


def on_playermove(player, ws, args):
	x = args[1]
	y = args[2]
	player.on_move(x, y)
