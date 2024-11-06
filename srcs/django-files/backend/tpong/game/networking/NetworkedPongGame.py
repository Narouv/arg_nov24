from tpong.game.structure.PongGame import PongGame
from tpong.game.networking.PongClientConsumer import PongClientConsumer
from tpong.models import PongMatch, PongStats
from tpong.serializers import PongMatchSerializer, StatsSerializer

from asgiref.sync import async_to_sync

import logging

logger = logging.getLogger(__name__)

class PongPlayer():
	def __init__(self, connection) -> None:
		self.connection : PongClientConsumer = connection
		self.user = connection.user
		self.side = None

class NetworkedPongGame(PongGame):
	def __init__(self, lobby) -> None:
		super().__init__(lobby)
		self.player = []
		
	def connectPlayer(self, connection : PongClientConsumer):
		logger.warning("Connected player to NetworkedPongGame")
		self.player.append(PongPlayer(connection))
		if self.currentMatch.type == "local":
			stats = PongStats(side="both")
		else:
			stats = self.currentMatch.getPlayerStatsFromUser(connection.user)
		matchInfo =	PongMatchSerializer(self.currentMatch).data
		matchInfo["controllingSide"] = stats.side
		async_to_sync(connection.send_json)({
			'success': True,
			'type': 'matchinfo',
			'data': matchInfo
			})
		self.broadcastEvent({
			"event": "score-change",
			"score": StatsSerializer(self.currentMatch.stats.all(), many=True).data
		})
	
	def disconnectPlayer(self, connection):
		for player in self.player:
			if player.connection == connection:
				self.player.remove(player)
				return

	def handleRemoteInput(self, inputData, user):
		if self.currentMatch.type != "local":
			stat = self.currentMatch.getPlayerStatsFromUser(user)
			if inputData['side'] == "left" != stat.side:
				return
			if inputData['side'] == "right" != stat.side:
				return
		self.paddles[inputData['side']].processRemoteInput(inputData)


	async def syncClients(self):
		data = {
			'type': 'replicate',
			'data': self.serializeState()
		}
		for connectedPlayer in self.player:
			try:
				await connectedPlayer.connection.send_json(data)
			except:
				logger.error(f"Error syncing client { connectedPlayer.user }")
				logger.error(f"Player { self.player }")
				await connectedPlayer.connection.close()

	def broadcastEvent(self, event):
		data = {
			'type': 'game-event',
			'data': event
		}
		self.broadcast(data)

	def broadcast(self, data):
		for connectedPlayer in self.player:
			async_to_sync(connectedPlayer.connection.send_json)(data)

		#try:
		#except:
		#	logger.error("Error broadcasting event")