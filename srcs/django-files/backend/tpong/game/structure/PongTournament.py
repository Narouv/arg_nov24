import math
import logging

logger = logging.getLogger(__name__)

class PongTournament():
    def __init__(self) -> None:
        self.participants = []
        self.roundsRequired = 0
        self.score = {
            
        }
        pass

    def addParticipant(self, participant):
        self.participants.append(participant)

    def startTournament(self):
        numParticipants = len(self.participants)
        self.roundsRequired = math.ceil(math.log2(numParticipants))

