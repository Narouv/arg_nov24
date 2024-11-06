#from channels.routing import ProtocolTypeRouter, URLRouter
#from django.urls import path
#from consumers import consumer
#
#application = ProtocolTypeRouter({
#    'websocket': URLRouter([
#        path('ws/test/', consumer.SockerConsumer.as_asgi()),
#    ])
#})