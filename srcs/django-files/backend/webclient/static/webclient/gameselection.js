

class GameModeManager
{
    constructor()
    {
        this.modeInfo= {
            local: "2 Players - Local\nCreates a local game for 2 players, both play on 1 keyboard",
            pvp: "2 Players - Remote\nEnters matchmaking for a remote pvp game.",
            tournament: "3-12 Players - Remote\nEnters matchmaking for a remote tournament game.",
        }

    }

    setInfo(mode)
    {
        var infoText = document.getElementById("game-mode-info-text")

        infoText.innerText = this.modeInfo[mode]
    }

    selectMode(mode)
    {
        if (mode == "local")
        {
            viewManager.getPage("local-game-select", null,false)
            return
        }
        //if (mode == "pvp")
        {
            viewManager.getPage("matchmaking-select", { type: mode }, false)
            return
        }
    }

    async runMatchMaking(matchType)
    {
        var data = await api.post(`/api/pong/matchmaking/register/`,{ "type": matchType });
        return data.success
    }

    async getActiveLobby()
    {
        var data = await api.get(`/api/pong/matchmaking/register/`);
        //console.log(data)
        return data.success
    }

    async startGame(type)
    {
        if (!await this.runMatchMaking(type))
            {
                const alertPlaceholder = document.getElementById('matchmakingAlertPlaceholder')
                const appendAlert = (message, type) => {
                const wrapper = document.createElement('div')
                    wrapper.innerHTML = [
                        `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                        `   <div>${message}</div>`,
                        '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                        '</div>'
                    ].join('')
    
                    alertPlaceholder.innerHTML = ""
                    alertPlaceholder.append(wrapper)
                }
                appendAlert("Matchmaking failed!", "danger")
                return
            }
            viewManager.getPage("game-active", null, false)
    }
}

window.gameModeManager = new GameModeManager()
