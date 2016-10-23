
import json
import time

import settings
from datatypes import MsgType


class Bullet:

	def __init__(self, guid, playerid, level, timestamp, x, y, vx, vy):
		self.guid = guid
		self.playerId = playerid
		self.level = level
		self.timestamp = timestamp
		self.x = x
		self.y = y
		self.vx = vx
		self.vy = vy
		self.max_persist_time = self.get_shoot_distance() / settings.BULLET_SPEED
		self.is_dead = False

	def update(self, dt):
		curtime = time.time() * 1000
		if curtime > self.timestamp + self.max_persist_time * 1000:
			self.is_dead = True

	def get_basic_info(self):
		return json.dumps([MsgType.scBulletInfo, self.guid, self.playerId, self.level, self.timestamp, self.x, self.y, self.vx, self.vy])

	def get_shoot_distance(self):
		# dist = 1
		if self.level == 1:
			dist = 8
		elif self.level == 2:
			dist = 9
		else:
			dist = 10
		return dist
