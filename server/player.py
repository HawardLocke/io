
import json
import time

from datatypes import MsgType
from msgsender import MsgSender


class Player:
	# Friction accleration
	acc_friction = 0.8
	# Control accleration
	acc_control = 1

	def __init__(self, guid, name, tp, ws, color):
		self.guid = guid
		self.name = name
		self.tp = tp
		self.color = color
		self.ws = ws
		self.alive = True
		self.joined = False
		self.x = 0
		self.y = 0
		self.vx = 0
		self.vy = 0
		self.forcex = 0
		self.forcey = 0
		self.max_speed = 1
		self.needSyncPos = False
		# network delay
		self.__ping_time = 0
		self.__can_ping = True
		self.__ping_count = 0
		self.network_delay_time = 0  # average delay

	def join(self, posx, posy):
		self.alive = True
		self.joined = True
		self.x = posx
		self.y = posy

	def update(self, dt):
		self.__check_ping()
		if self.joined:
			return
			# self.update_position(dt)
			# if self.needSyncPos:
			# self.broadcast_position()
		pass

	def __check_ping(self):
		if self.__can_ping:
			curtime = time.time()*1000
			if curtime - self.__ping_time > 1*1000:
				self.__ping_time = curtime
				self.__ping_count += 1
				self.__can_ping = False
				self.send_ping(self.__ping_count, self.__ping_time)
		pass

	def on_move(self, dirx, diry, timestamp):
		if not self.alive:
			return
		self.forcex = dirx
		self.forcey = diry
		self.broadcast_movestate(timestamp)

	def on_ping(self, ping_count, client_time):
		# print('on ping')
		if self.__ping_count == ping_count:
			self.__can_ping = True
			curtime = time.time()*1000
			self.network_delay_time = ((self.__ping_count - 1) * self.network_delay_time + (curtime - self.__ping_time) * 0.5) / self.__ping_count
			pass

	def setposition(self, x, y):
		self.x = x
		self.y = y

	def setvelocity(self, x, y):
		self.vx = x
		self.vy = y

	def get_basic_info(self):
		return json.dumps([MsgType.scPlayerInfo, self.guid, self.name, self.tp, self.x, self.y, self.color])

	def get_transform_info(self):
		return json.dumps([MsgType.scMove, self.guid, self.x, self.y, self.vx, self.vy, self.forcex, self.forcey, time.time()*1000])

	def send_ping(self, pingcount, pingtime):
		MsgSender.send_to(self, MsgType.scPing, pingcount, self.network_delay_time, pingtime)
		# print('send ping: %d' % pingcount)
		pass

	def broadcast_movestate(self, timestamp):
		MsgSender.send_to_nearby(MsgType.scMove, self.guid, self.x, self.y, self.vx, self.vy, self.forcex, self.forcey, timestamp)
		pass

	'''def broadcast_position(self):
		MsgSender.send_to_nearby(MsgType.scTransform, self.guid, self.x, self.y, self.vx, self.vy, self.forcex, self.forcey)
		pass'''
