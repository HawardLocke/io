import os
import asyncio
import json
from aiohttp import web

import settings
from game import Game
from msghandler import MsgHandler


async def handle(request):
	return web.Response(status=404)

async def wshandler(request):
	print("connected")
	_game = request.app["game"]
	msghandler = request.app["msghandler"]
	ws = web.WebSocketResponse()
	await ws.prepare(request)

	player = None
	while True:
		msg = await ws.receive()
		if msg.tp == web.MsgType.text:
			print("recv msg %s" % msg.data)
			data = json.loads(msg.data)
			msghandler.on_msg(player, ws, data)
		elif msg.tp == web.MsgType.close:
			break

	if player:
		_game.player_disconnected(player)

	print("disconnected")
	return ws

async def game_loop(game):
	tick = 1./settings.GAME_SPEED
	while 1:
		game.update_world(tick)
		await asyncio.sleep(1./settings.GAME_SPEED)


event_loop = asyncio.get_event_loop()
event_loop.set_debug(True)

app = web.Application()

game = Game()
app["game"] = game
app["msghandler"] = MsgHandler(game)
app["msghandler"].regist_all()

app.router.add_route('GET', '/connect', wshandler)
# app.router.add_route('GET', '/{name}', handle)
# app.router.add_route('GET', '/', handle)

asyncio.ensure_future(game_loop(game))

port = int(os.environ.get('PORT', 5000))
web.run_app(app, host='127.0.0.1', port=port)
