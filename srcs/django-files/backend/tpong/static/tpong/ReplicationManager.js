import { vec2 } from "./vec2.js";
import InputManager from "./InputManager.js";

export class ReplicationManager
{
	constructor(gameClient)
	{
		this.matchInfo = null;
		this.lobbyInfo = null;
		this.connection = undefined
		this.connected = false
		this.gameClient = gameClient;
		this.gameObjectManager = gameClient.objMngr;
		this.lastServerUpdate = Date.now()
		this.lastInputInfo = {left: null, right: null}
		this.dataHandler = {}
		this.dataHandler["replicate"] = this.clientReplicateObjects.bind(this)
		this.dataHandler["matchinfo"] = this.processMatchInfo.bind(this)
		this.dataHandler["lobbyinfo"] = this.processLobbyInfo.bind(this)
		this.dataHandler["game-event"] = this.processGameEvent.bind(this)
		this.dataHandler["pong"] = this.pong.bind(this)
	}

	connect(wsUrl)
	{
		if (this.connected)
			return
		this.connection = new WebSocket(wsUrl)
		this.connection.onopen = this.onConnectionOpen.bind(this)
		this.connection.onmessage = this.onConnectionRecieve.bind(this)
		this.connection.onclose = this.onConnectionClose.bind(this)
	}
	
	disconnect()
	{
		if (!this.connected)
			return;
		this.connection.close()
		this.connection = undefined
	}

	createServerInput(code, keyDown)
	{
		for (var keybinding of this.gameClient.settings.keyBindings)
		{
			var inputInfo = { 
				side: keybinding.side,
				keyDown: keyDown
			};
			if (keybinding.keyUp == code)
				inputInfo.dir = "up"
			else if (keybinding.keyDown == code)
				inputInfo.dir = "down"
			else
				continue;
			this.serverSendInput(inputInfo)
		}
		if (code == "KeyE" && keyDown)
		{
			
		}
	}

	onKeyDown(code)
	{
		this.createServerInput(code, true)
	}

	onKeyUp(code)
	{
		this.createServerInput(code, false)
	}

	onConnectionOpen()
	{
		console.log("Connection opened")
		this.connected = true
		InputManager.registerKeyDown(this.onKeyDown.bind(this))
		InputManager.registerKeyUp(this.onKeyUp.bind(this))
		this.pingCheck = setInterval(
			function(){
				this.connection.send(JSON.stringify({
					type: 'ping',
					timestamp: Date.now()
				}))
			}.bind(this),
			1000
		)
	}

	onConnectionClose()
	{
		console.log("Connection closed")
		this.connected = false
		this.connection = undefined
		clearInterval(this.pingCheck)
	}

	onConnectionRecieve(event)
	{
		if (!event.data)
			return
		var data = JSON.parse(event.data)
		if (!this.dataHandler[data.type])
			return
		this.dataHandler[data.type](data.data)
	}

	pong(timestamp)
	{
		var diff =  Date.now() - new Date(timestamp)
		gameManager.updatePing(diff)
	}

	processLobbyInfo(lobbyInfo)
	{
		this.lobbyInfo = lobbyInfo;
		if (lobbyInfo.state == "WAITING_CONNECT")
			this.gameObjectManager.overlay.setText("Waiting...", -1)

	}

	processGameEvent(event)
	{
		console.log(event)
		if (event.event == "start-round")
			this.gameObjectManager.overlay.startCountdown(event.delay)
		if (event.event == "score-change")
			gameManager.updateScore(event.score)
		if (event.event == "game-end")
			this.gameObjectManager.overlay.setText("Game Over!", 5000)
		if (event.event == "lobby-closing")
		{
			this.connection.close()
			gameManager.onGameEnd()
		}
	}

	setupLocalMatch()
	{
		this.gameObjectManager.pongBall.reset();
		this.gameObjectManager.paddles.left.reset();
		this.gameObjectManager.paddles.right.reset();
	}

	processMatchInfo(matchInfo)
	{
		this.matchInfo = matchInfo;
		console.log(this.matchInfo)
		if (matchInfo.type == 'local')
		{
			this.gameObjectManager.paddles.left.networkingState = 'controlling'
			this.gameObjectManager.paddles.right.networkingState = 'controlling'
			this.setupLocalMatch()
		}
		if (matchInfo.type == 'pvp')
		{
			this.gameObjectManager.paddles.left.networkingState = 'replicated'
			this.gameObjectManager.paddles.right.networkingState = 'replicated'
			this.gameObjectManager.paddles[matchInfo.controllingSide].networkingState = 'controlling'
			this.setupLocalMatch()
		}
	}

	replicatePaddle(info)
	{
		var paddle = this.gameObjectManager.paddles[info.paddleSide]

		paddle.serverHeightNormal = info.paddleHeight;
		paddle.velocityNormal = info.paddleVelocity;
		paddle.sizeNormal = new vec2(info.paddleSize.x, info.paddleSize.y);
	}

	replicateBall(info)
	{
		var ball = this.gameObjectManager.pongBall
		
		ball.ballNormal = new vec2(info.ballPosition.x, info.ballPosition.y);
		ball.velocityNormal = new vec2(info.ballVelocity.x, info.ballVelocity.y);
		ball.radiusNormal = info.ballRadius;
	}

	clientReplicateObjects(replicationInfo)
	{
		for (var replicatable of replicationInfo)
		{
			if (replicatable.objName == 'paddle')
				this.replicatePaddle(replicatable)
			else if (replicatable.objName == 'pongball')
				this.replicateBall(replicatable)
		}
		
	}

	serverReplicateObjects(replicationInfo)
	{
		if (!this.connected || !replicationInfo.length)
			return
		this.connection.send(JSON.stringify({
			type: 'replicate',
			replicationInfo: replicationInfo
		}))
	}

	serverSendInput(inputInfo)
	{
		if (!this.connected)
			return
		if (this.lastInputInfo[inputInfo.side] 
			&& this.lastInputInfo[inputInfo.side].keyDown == inputInfo.keyDown
			&& this.lastInputInfo[inputInfo.side].dir == inputInfo.dir)
			return
		this.lastInputInfo[inputInfo.side] = inputInfo;
		this.connection.send(JSON.stringify({
			type: 'input',
			inputInfo: inputInfo
		}))
	}

	updateServer()
	{
		var timeSinceLastUpdate = (Date.now() - this.lastServerUpdate) / 1000

		if (timeSinceLastUpdate < 0.1)
			return;
		this.lastServerUpdate = Date.now()
		this.updatePaddles()
	}
	
	updatePaddles()
	{
		var replicationInfo = []

		if (this.gameObjectManager.paddles.left.networkingState == 'controlling')
		replicationInfo.push(this.gameObjectManager.paddles.left.serialize())
		if (this.gameObjectManager.paddles.right.networkingState == 'controlling')
		replicationInfo.push(this.gameObjectManager.paddles.right.serialize())
		//this.serverReplicateObjects(replicationInfo)
	}
}
