import { GObjMngr } from "./GameObjectManager.js";
import { ReplicationManager } from "./ReplicationManager.js";
import InputManager from "./InputManager.js";

function sleep(ms)
{
	return new Promise((resolve, reject) => {
		setTimeout(() =>{resolve()}, ms)
	})
}

export class GameClient
{
	constructor(minFrameTime)
	{
		this.frameInfo = {
			
		}
		this.runGame = false;
		this.fps = 1;
		this.delta = 1;
		this.lastTickTime = 0;
		this.minFrameTime = minFrameTime;
		this.objMngr = new GObjMngr();
		this.settings = {
			keyBindings: [
				{ side: 'left', keyUp: 'KeyW', keyDown: 'KeyS' },
				{ side: 'right', keyUp: 'ArrowUp', keyDown: 'ArrowDown' }
			],
			
		}
		this.replication = new ReplicationManager(this);
	}

	calcFps()
	{
		if (this.delta)
			this.fps = (this.fps + (1 / this.delta)) / 2;
	}

	calcDelta()
	{
		this.delta = (Date.now() - this.lastTickTime) / 1000;
		this.lastTickTime = Date.now();
	}

	async gameLoop()
	{
		while (this.runGame)
		{
			this.calcDelta();
			this.calcFps();
		
			this.objMngr.runSimulation(this.delta);
			this.objMngr.syncDOM(this.delta);
			this.replication.updateServer()
	
			await sleep(this.minFrameTime);
		}
	}

	async startEngine()
	{
		this.objMngr.overlay.load()
		for (var binding of this.settings.keyBindings)
		{
			InputManager.preventAction[binding.keyDown] = true;
			InputManager.preventAction[binding.keyUp] = true;
		}
		if (this.runGame)
			return
		this.runGame = true;
		this.lastTickTime = Date.now();
		this.gameLoopPromise = this.gameLoop();
	}

	async stopEngine()
	{
		InputManager.preventAction = {}
		if (!this.runGame)
			return
		this.runGame = false;
		await this.gameLoopPromise
	}

	async endEngine()
	{
		await this.stopEngine()
		await this.disconnect()
	}

	async connect()
	{
		if (!await api.verifyAuthenticated())
		{
			console.log("Not Authenticated - cant connect")	
			return;
		}
		var protocol = window.location.protocol == "https:" ? 'wss': 'ws'
		this.replication.connect(protocol + '://' + window.location.host + '/ws/tpong/')
	}

	async disconnect()
	{
		this.replication.disconnect()
	}
};