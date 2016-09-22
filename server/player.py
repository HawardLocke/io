
from random import randint, choice
import json

import settings
from datatypes import MsgType


class Player:
	# Friction accleration
	acc_friction = 0.8
	# Control accleration
	acc_control = 1

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
		self.forcex = 0
		self.forcey = 0
		self.max_speed = 1
		self.needSyncPos = False

	def join(self, posx, posy):
		self.alive = True
		self.joined = True
		self.x = posx
		self.y = posy

	def update(self, tick):
		if self.joined:
			self.update_position(tick)

			if self.needSyncPos:
				self.send_to_self(MsgType.scTransform, self.guid, self.x, self.y)

	def update_position(self, tick):
		if self.forcex != 0:
			self.vx += self.forcex * Player.acc_control * tick
			if abs(self.vx) > self.max_speed:
				if self.vx > 0:
					self.vx = self.max_speed
				else:
					self.vx = -self.max_speed
		if self.forcey != 0:
			self.vy += self.forcey * Player.acc_control * tick
			if abs(self.vy) > self.max_speed:
				if self.vy > 0:
					self.vy = self.max_speed
				else:
					self.vy = -self.max_speed

		if self.vx > 0:
			self.vx -= Player.acc_friction * tick
			if self.vx <= 0:
				self.vx = 0
		if self.vx < 0:
			self.vx += Player.acc_friction * tick
			if self.vx >= 0:
				self.vx = 0
		if self.vy > 0:
			self.vy -= Player.acc_friction * tick
			if self.vy <= 0:
				self.vy = 0
		if self.vy < 0:
			self.vy += Player.acc_friction * tick
			if self.vy >= 0:
				self.vy = 0

		if self.vx != 0:
			self.x += self.vx * tick
		if self.vy != 0:
			self.y += self.vy * tick

		self.needSyncPos = self.vx != 0 or self.vy != 0

	def on_move(self, dirx, diry):
		if not self.alive:
			return
		self.forcex = dirx
		self.forcey = diry

	def setposition(self, x, y):
		self.x = x
		self.y = y

	def send_to_self(self, *args):
		msg = json.dumps([args])
		self.ws.send_str(msg)
