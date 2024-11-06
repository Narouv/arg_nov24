
class GameManger
{
    constructor()
    {
        this.scoreData = null;
    }

    onViewLoad()
    {
        window.initGame()
        gameObject.connect()
        this.updateScore(this.scoreData)
    }

    updateScore(scoreData)
    {
        if (!scoreData)
            return;
        this.scoreData = scoreData;
        for (var score of scoreData)
        {
            var sideName = score.side[0].toUpperCase() + score.side.slice(1)
            var scoreElement = document.getElementById("playerScore" + sideName)
            var nameElement = document.getElementById("playerName" + sideName)
            scoreElement.innerText = score.score
            nameElement.innerText = score.playerName
        }
    }

    updatePing(ping)
    {
        var obj = document.getElementById("pingTxt")
        if (obj)
            obj.innerText = "Ping: "  + ping
    }

    onGameEnd()
    {
        this.scoreData = null;
        setTimeout(()=>{viewManager.getPage("match-result", { matchId: gameObject.replication.matchInfo.id}, false)}, 3000)
    }

    //async loadMatchResult()
    //{
    //    var result = await api.get(`/api/pong/match/?id=${gameObject.replication.matchInfo.id}`)
    //    if (!result.success)
    //        return
    //    var matchInfo = result.data
    //    var winnerStats = null
    //    for (var stats of matchInfo.stats)
    //    {
    //        if (stats.score == matchInfo.maxScore)
    //        {
    //            winnerStats = stats
    //            break
    //        }
    //    }
    //    var winnerName = document.getElementById("resultNameWinner")
    //    winnerName.parentElement.classList.add(`side-${ winnerStats.side.toLowerCase() }`)
    //    if (matchInfo.type != "local")
    //    {
    //        if (winnerStats.playerName)
    //            winnerName.innerText = winnerStats.playerName
    //        else
    //            winnerName.innerText = winnerStats.user.username
    //    }
    //    else
    //        winnerName.innerText = winnerStats.side == "left" ? "Left" : "Right"
    //}
};

window.gameManager = new GameManger(); 
