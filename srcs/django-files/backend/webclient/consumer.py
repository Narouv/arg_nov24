import json
from channels.generic.websocket import AsyncJsonWebsocketConsumer, AsyncWebsocketConsumer, WebsocketConsumer

class SockerConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
    async def disconnect(self, close_code):
        pass
    #async def receive(self, text_data):
    #    text_data_json = json.loads(text_data)
    #    message = text_data_json['message']
    #    await self.send(text_data=json.dumps({
    #        'message': 'Zeah'
    #    }))
    async def receive_json(self, content):
        await self.send_json({
            'message': 'Ok',
            'content': content
        })


