from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async
from tpong.models import PongMatch, PongStats
from .lobby import PongLobbyManager
import logging

logger = logging.getLogger(__name__)

class PongClientConsumer(AsyncJsonWebsocketConsumer):
	def __init__(self) -> None:
		super().__init__()
		self.registerd = False
		self.lobby = None

	def validate(self):
		if self.registerd:
			return True
		self.lobby = PongLobbyManager.lobbyManagerInstance.registerConnection(self)
		if self.lobby != None:
			return True
		return False

	async def connect(self):
		user = self.scope['user']
		if not user.id:
			return await self.close()		
		self.user = user
		await self.accept()
		if not await sync_to_async(self.validate)():
			logger.warning(f'Denying user: {user} { user.id }')
			await self.send_json({'success': False, 'message': 'Cant register'})
			return await self.close()
		self.registerd = True
		await self.send_json({
			'success': True,
			'type': 'lobbyinfo',
			'data': self.lobby.serialize(), 
			'msg': 'Sucessfull registered in lobby!'
		})
		logger.warning(f'Connected user: {user} { user.id }')

	async def disconnect(self, close_code):
		await sync_to_async(PongLobbyManager.lobbyManagerInstance.unregisterConnection)(self)

	async def receive_json(self, content):
		if not self.registerd:
			return await self.close()
		await sync_to_async(self.lobby.handleClientData)(self, content)
