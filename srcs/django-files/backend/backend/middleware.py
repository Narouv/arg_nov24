from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTAuthentication
from asgiref.sync import sync_to_async
import logging
logger = logging.getLogger(__name__)

class ChannelsJWTAuthMiddleware:
    def __init__(self, app):
        self.app = app

    async def validateToken(self, token, scope):
        jwtAuth = JWTAuthentication()
        validated_token = jwtAuth.get_validated_token(raw_token=token.encode('utf-8'))
        if not validated_token:
            return False
        user = await sync_to_async(jwtAuth.get_user)(validated_token)
        if not user:
            return False
        scope['user'] = user
        return True

    async def authenticate(self, scope):
        headers = dict(scope['headers'])
        if b'cookie' in headers:
            cookies = headers[b'cookie'].decode().split('; ')
            for  cookie in cookies:
                key, value = cookie.split('=')
                try:
                    if key == 'jwt_token' and await self.validateToken(value, scope):
                        return True
                except:
                    pass
        scope['user'] = AnonymousUser()
        return False

    async def __call__(self, scope, receive, send):
        await self.authenticate(scope)
        return await self.app(scope, receive, send)