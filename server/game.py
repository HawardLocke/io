from random import randint, choice
import json

import settings
from player import Player
from datatypes import MsgType


class Game:

	def __init__(self):
		self._last_id = 0
		self._players = {}
		self._top_scores = []

	def create_world(self):
		pass

	def update_world(self, tick):
		for player in self._players.values():
			player.update(tick)

	def new_player(self, name, seed, ws):
		self._last_id += 1
		guid = self._last_id

		self.send_personal(ws, MsgType.scNewPlayer, name, guid)
		# self.send_personal(ws, MsgType.scWorldInfo, self._world)

		tp = randint(1, 9)
		player = Player(guid, name, tp, ws)
		self._players[guid] = player

		print('player count %d' % self.count_alive_players())

		return player

	def join(self, player, ws):
		if player.alive:
			return
		if self.count_alive_players() == settings.MAX_PLAYERS:
			self.send_personal(ws, MsgType.scError, "Too many players !")
			return
		x, y = self._get_spawn_position()
		player.join(x, y)
		self.send_all(MsgType.scJoined, player.guid, player.name, player.tp, x, y)
		print('player %s joins.' % player.name)

	def player_disconnected(self, player):
		player.ws = None
		guid = player.guid
		del self._players[player.guid]
		del player
		self.send_all(MsgType.scDeletePlayer, guid)
		print('player count %d' % self.count_alive_players())

	def count_alive_players(self):
		return sum([int(p.alive) for p in self._players.values()])

	def _get_spawn_position(self):
		x = 1
		y = 1
		return x, y

	def read_top_scores(self):
		try:
			f = open("top_scores.txt", "r+")
			content = f.read()
			if content:
				self._top_scores = json.loads(content)
			else:
				self._top_scores = []
			f.close()
		except FileNotFoundError:
			pass

	def store_top_scores(self):
		f = open("top_scores.txt", "w")
		f.write(json.dumps(self._top_scores))
		f.close()

	def send_personal(self, ws, *args):
		msg = json.dumps([args])
		ws.send_str(msg)

	def send_all(self, *args):
		self.send_all_multi([args])

	def send_all_multi(self, commands):
		msg = json.dumps(commands)
		for player in self._players.values():
			if player.ws:
				player.ws.send_str(msg)

