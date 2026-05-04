import json
from channels.generic.websocket import AsyncWebsocketConsumer

class CallConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("calls", self.channel_name)
        await self.accept()
        print(f"WebSocket connected: {self.channel_name}")

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("calls", self.channel_name)
        print(f"WebSocket disconnected: {self.channel_name}")

    # Receive message from group and send to WebSocket client
    async def call_update(self, event):
        await self.send(text_data=json.dumps(event["data"]))