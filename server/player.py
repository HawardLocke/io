
from collections import deque
from random import randint
import settings


class Player:

	def __init__(self, player_id, name, tp, ws):
		self.guid = player_id
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

	def join(self, posx, posy):
		self.alive = True
		self.joined = True
		self.x = posx
		self.y = posy

	def update(self, tick):
		if self.joined:
			self.x += self.vx * tick
			self.y = self.vy * tick

	def on_move(self, x, y):
		if not self.alive:
			return
		self.vx = x
		self.vy = y

	def setposition(self, x, y):
		self.x = x
		self.y = y
