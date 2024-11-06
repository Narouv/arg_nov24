from tpong.game.engine.Vec2 import Vec2
from .Collidable import Collidable
import logging

logger = logging.getLogger(__name__)

class PongBall(Collidable):
	def __init__(self) -> None:
		super().__init__('circle')
		self.radius = 0.01
		self.position = Vec2(0.5, 0.5)
		self.velocity = Vec2()
		#self.velocity.x = -0.3
		#self.velocity.y = -0.15

	def simulate(self, delta):
		newPos = self.position + (self.velocity * delta)
		newPos.clamp(1 - self.radius, self.radius)
		self.position = newPos
	
	def serializeState(self):
		return {
			'objName': 'pongball',
			'ballPosition': {
				'x': self.position.x,
				'y': self.position.y
			},
			'ballVelocity': {
				'x': self.velocity.x,
				'y': self.velocity.y
			},
			'ballRadius': self.radius
		}
	
	def onCollision(self, collision):
		#logger.warning(f"Ball Collision: x:{collision['side'].x} y:{collision['side'].y}")
		if collision['clipPos'].x:
			self.position.x = collision['clipPos'].x
		if collision['clipPos'].y:
			self.position.y = collision['clipPos'].y
		
		if (collision['side'].x == -1 and self.velocity.x < 0) or (collision['side'].x == 1 and self.velocity.x > 0):
			self.velocity.x *= -1
		if (collision['side'].y == 1 and self.velocity.y < 0) or (collision['side'].y == -1 and self.velocity.y > 0):
			self.velocity.y *= -1

	def reset(self):
		self.position = Vec2(0.5, 0.5)
		self.velocity = Vec2()