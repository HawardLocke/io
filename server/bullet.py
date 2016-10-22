
import json

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

	def get_basic_info(self):
		return json.dumps([MsgType.scBulletInfo, self.guid, self.playerId, self.level, self.timestamp, self.x, self.y, self.vx, self.vy])
