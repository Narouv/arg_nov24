#from .PongTournament import PongTournament
from .PongLobby import PongLobby, LobbyState

class TournamentLobby(PongLobby):
    TYPE="tournament"
    def __init__(self) -> None:
        super().__init__(12, TournamentLobby.TYPE)
        self.activeGameInstances = []

    def onConnect(self, connection):
        pass
        #self.gameInstance.currentMatch.addPlayer(connection.user)
        #self.gameInstance.connectPlayer(connection)
    
    def onDisconnect(self, connection):
        pass
        #self.gameInstance.disconnectPlayer(connection)

    def onLobbyReady(self):
        pass
        #self.lobbyState = LobbyState.RUNNING
        #self.gameInstance.startGame()

    def onGameTick(self, delta):
        self.gameInstance.gameTick(delta)

    def onClientData(self, connection, data):
        if data['type'] == 'input':
            self.gameInstance.handleRemoteInput(data['inputInfo'], connection.user)

    async def onSyncClients(self):
        await self.gameInstance.syncClients()

