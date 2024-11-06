import uuid
from tpong.models import PongMatch, PongStats
from tpong.game.structure import PongGame
from tpong.game.structure.PongGame import PongGame
from tpong.game.networking.PongClientConsumer import PongClientConsumer
from enum import Enum
from asgiref.sync import async_to_sync

import logging

logger = logging.getLogger(__name__)

class LobbyState(Enum):
	WAITING_CONNECT = "WAITING_CONNECT"
	RUNNING = "RUNNING"
	IDLE = "IDLE"

	def __str__(self):
		return str(self.value)

class PongLobby():
	def __init__(self, lobbySize, type) -> None:
		self.uuid = uuid.uuid1()
		self.registeredUser = []
		self.playerConnections = []
		self.playersDisconnected = []
		self.maxConnection = lobbySize
		self.lobbyState = LobbyState.WAITING_CONNECT
		self.type = type

	def connectPlayer(self, connection : PongClientConsumer):
		if self.lobbyState is not LobbyState.WAITING_CONNECT and connection.user not in self.playersDisconnected:
			return False
		self.playerConnections.append(connection)
		if callable(self.onConnect):
			self.onConnect(connection)
		if len(self.playerConnections) is self.maxConnection and self.lobbyState is LobbyState.WAITING_CONNECT:
			if callable(self.onLobbyReady):
				self.onLobbyReady()

	def disconnectPlayer(self, connection : PongClientConsumer):
		self.playersDisconnected.append(connection.user)
		self.playerConnections.remove(connection)
		if callable(self.onDisconnect):
			self.onDisconnect(connection)

	def gameTick(self, delta):
		if callable(self.onGameTick):
			self.onGameTick(delta)

	async def syncClients(self):
		if callable(self.onSyncClients):
			await self.onSyncClients()

	def handleClientData(self, connection, data):
		if data['type'] == "ping":
			async_to_sync(connection.send_json)({
				"type": "pong",
				"data": data['timestamp']
			})
			return
		if callable(self.onClientData):
			self.onClientData(connection, data)
		async_to_sync(self.syncClients)

	def broadcastLobby(self, data):
		for connectedPlayer in self.playerConnections:
			async_to_sync(connectedPlayer.send_json)(data)

	async def lifeCheck(self):
		for connectedPlayer in self.playerConnections:
			await connectedPlayer.send_json({
				"type": 'keepalive'
			})

	def serialize(self):
		return {
			"uuid": str(self.uuid),
			"type": self.type,
			"state": str(self.lobbyState),
		}
	
	def onDestruct(self):
		pass