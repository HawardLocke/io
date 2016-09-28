
import time
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
		self.regist(MsgType.csPing, on_ping)

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
	timestamp = time.time()*1000 - args[1]
	time.time()
	dir_x = args[2]
	dir_y = args[3]
	player.on_move(dir_x, dir_y)


def on_ping(player, ws, args):
	server_time = args[1]
	client_time = args[2]
	player.on_ping(server_time, client_time)
