from channels.generic.websocket import AsyncJsonWebsocketConsumer
from asgiref.sync import sync_to_async, async_to_sync

class UserConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        user = self.scope['user']
        if not user.id:
            return await self.close()		
        self.user = user
        await self.accept()
        self.user.online = True
        await sync_to_async(self.user.save)()

    async def disconnect(self, close_code):
        self.user.online = False
        await sync_to_async(self.user.save)()

    async def receive_json(self, content):
        pass
