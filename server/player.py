
from random import randint, choice
import json

import settings
from datatypes import MsgType


class Player:

	def __init__(self, guid, name, tp, ws):
		self.guid = guid
		self.name = name
		self.tp = tp
		self.color = None
		self.ws = ws
		self.alive = False
		self.joined = False
		self.x = 0
		self.y = 0
		self.vx = 0
		self.vy = 0
		self.needSyncPos = False

	def join(self, posx, posy):
		self.alive = True
		self.joined = True
		self.x = posx
		self.y = posy

	def update(self, tick):
		if self.joined:
			if self.vx != 0:
				self.x += self.vx * tick
			if self.vy != 0:
				self.y += self.vy * tick
		if self.needSyncPos:
			self.send_to_self(MsgType.scTransform, self.guid, self.x, self.y)

	def on_move(self, x, y):
		if not self.alive:
			return
		self.vx = x
		self.vy = y
		self.needSyncPos = x != 0 or y != 0

	def setposition(self, x, y):
		self.x = x
		self.y = y

	def send_to_self(self, *args):
		msg = json.dumps([args])
		self.ws.send_str(msg)
