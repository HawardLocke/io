from random import randint
import json

import settings
from player import Player
from enegyball import EnegyBall
from bullet import Bullet
from datatypes import MsgType


class Game:

	def __init__(self):
		self._last_id = 0
		self._players = {}
		self._top_scores = []
		self._enegyBallList = {}
		self._last_enegy_guid = 0
		self._bullet_list = {}
		self._last_bullet_guid = 0
		self._dead_bullet_list = []

	def get_players(self):
		return self._players

	def get_player(self, playerid):
		if playerid in self._players:
			return self._players[playerid]
		else:
			return None

	def get_bullet(self, bulletid):
		if bulletid in self._bullet_list:
			return self._bullet_list[bulletid]
		else:
			return None

	def create_world(self):
		for i in range(100):
			self._last_enegy_guid += 1
			guid = self._last_enegy_guid
			x = settings.WORLD_WIDTH * 0.5 + randint(-100, 100) / (settings.WORLD_WIDTH * 0.5)
			y = settings.WORLD_WIDTH * 0.5 + randint(-100, 100) / (settings.WORLD_WIDTH * 0.5)
			enegy_inst = EnegyBall(guid, x, y, randint(5, 20))
			self._enegyBallList[guid] = enegy_inst
		pass

	def update_world(self, dt):
		for k in self._players:
			self._players[k].update(dt)
		for k in self._bullet_list:
			bullet = self._bullet_list[k]
			bullet.update(dt)
			if bullet.is_dead:
				self._dead_bullet_list.append(k)
		for k in self._dead_bullet_list:
			if k in self._bullet_list:
				del self._bullet_list[k]
		if len(self._dead_bullet_list) > 0:
			self._dead_bullet_list.clear()

	def new_player(self, name, seed, ws):
		self._last_id += 1
		guid = self._last_id

		self.send_personal(ws, MsgType.scNewPlayer, name, guid)
		self.send_personal(ws, MsgType.scWorldInfo, settings.WORLD_WIDTH, settings.WORLD_HEIGHT)

		tp = randint(1, 9)
		color = randint(0, 9)
		player = Player(guid, name, tp, ws, color)
		self._players[guid] = player

		print('player count %d' % self.count_alive_players())

		return player

	def join(self, player, ws):
		if player.joined:
			return
		if self.count_alive_players() == settings.MAX_PLAYERS:
			self.send_personal(ws, MsgType.scError, "Too many players !")
			return
		x, y = self._get_spawn_position()
		player.join(x, y)
		player.force_ping()
		self.send_all(MsgType.scJoined, player.guid, player.name, player.tp, x, y, player.color)
		for enegy in self._enegyBallList.values():
			self.send_personal(ws, MsgType.scEnegyInfo, enegy.guid, enegy.x, enegy.y, enegy.enegy)
		self.send_nearby_players_info_to(player)
		self.send_nearby_bullet_info_to(player)
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
		x = settings.WORLD_WIDTH * 0.5  # randint(1, 4)
		y = settings.WORLD_WIDTH * 0.5  # randint(1, 4)
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

	def send_nearby_players_info_to(self, player):
		for _pl in self._players.values():
			if _pl.guid == player.guid:
				continue
			player.ws.send_str(_pl.get_basic_info())
			player.ws.send_str(_pl.get_transform_info())

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

	def on_eat_enegy_ball(self, player, ballid):
		ball_id = int(ballid)
		# print('on eat %d' % ball_id)
		if ball_id in self._enegyBallList:
			ball = self._enegyBallList[ball_id]
			enegy_value = ball.enegy
			player.add_enegy(enegy_value)
			del self._enegyBallList[ball_id]
			self.send_all(MsgType.scEnegyChange, player.guid, enegy_value)
			self.send_all(MsgType.scEatEnegyBall, player.guid, ball_id)
		pass

	def on_shoot_bullet(self, player, timestamp, x, y, dirx, diry):
		cost = settings.SHOOT_COST_ENEGY
		if player.enegy < cost:
			return
		player.add_enegy(-cost)
		self._last_bullet_guid += 1
		guid = self._last_bullet_guid
		level = 1
		vx = dirx * settings.BULLET_SPEED
		vy = diry * settings.BULLET_SPEED
		inst = Bullet(guid, player.guid, level, timestamp, x, y, vx, vy)
		self._bullet_list[guid] = inst
		self.send_all(MsgType.scEnegyChange, player.guid, -cost)
		self.send_personal(player.ws, MsgType.scShoot)
		self.send_all(MsgType.scBulletInfo, guid, player.guid, level, timestamp, x, y, vx, vy)
		pass

	def send_nearby_bullet_info_to(self, player):
		for inst in self._bullet_list.values():
			player.ws.send_str(inst.get_basic_info())
