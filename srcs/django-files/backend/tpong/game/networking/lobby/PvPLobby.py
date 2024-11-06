from .PongLobby import PongLobby, LobbyState
from tpong.game.networking.NetworkedPongGame import NetworkedPongGame
from tpong.models import PongMatch, PongStats

class PvPLobby(PongLobby):
    TYPE="pvp"
    def __init__(self) -> None:
        super().__init__(2, PvPLobby.TYPE)
        self.gameInstance = NetworkedPongGame(self)
        match = PongMatch(type=PvPLobby.TYPE, maxScore=1)
        match.save()
        self.gameInstance.currentMatch = match

    def onConnect(self, connection):
        self.gameInstance.currentMatch.addPlayer(connection.user)
        self.gameInstance.connectPlayer(connection)
    
    def onDisconnect(self, connection):
        self.gameInstance.disconnectPlayer(connection)

    def onLobbyReady(self):
        self.lobbyState = LobbyState.RUNNING
        self.gameInstance.startGame()

    def onGameTick(self, delta):
        self.gameInstance.gameTick(delta)

    def onGameStateChange(self, game, state):
        if state == "gameover":
           game.broadcastEvent({ "event": "lobby-closing" })

    def onClientData(self, connection, data):
        if data['type'] == 'input':
            self.gameInstance.handleRemoteInput(data['inputInfo'], connection.user)

    async def onSyncClients(self):
        await self.gameInstance.syncClients()
