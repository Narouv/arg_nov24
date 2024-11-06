import { GameClient } from "./GameClient.js";
//
//var gameObjectManager = new GObjMngr();
//var replicationManager = new ReplicationManager(gameObjectManager, 'ws://localhost:8001/ws/tpong/')
//
//var c = 0;
//function sleep(ms)
//{
//	return new Promise((resolve, reject) => {
//		setTimeout(() =>{resolve()}, ms)
//	})
//}
//
//var fps = 0.0;
//var lastTickTime;
//async function gameTick()
//{
//	var delta = (Date.now() - lastTickTime) / 1000;
//	lastTickTime = Date.now();
//
//	var fpsStr = Math.round(fps).toString();
//	//document.getElementById('bp-fps').innerText = fpsStr;
//
//	if (delta)
//		fps = (fps + (1 / delta)) / 2;
//	if (InputManager.keysDown['KeyT'])
//		delta /= 10;
//
//	gameObjectManager.runSimulation(delta);
//	gameObjectManager.syncDOM();
// 
//	await sleep(14);
//	if (c < 2)
//	gameTick();
//}
//
//async function manageNetwork()
//{
//	replicationManager.connect()
//	while (!replicationManager.connected)
//		await sleep(50);
//	console.log("Connected!");
//}
//
//function onSiteLoad()
//{
//	lastTickTime = Date.now();
//	gameTick();
//	manageNetwork();
//}
//
////onSiteLoad()

var game = new GameClient();

function htmlContent()
{
	return `<link rel="stylesheet" href="/static/tpong/pong-game.css">
	<div class="game-canvas">
	<div class="game-window">
		<div class="paddle-left"></div>
		<div class="paddle-right"></div>
		<div class="pong-ball"></div>
	</div>
	<div class="overlay">
	</div>
	</div>
	`
}

function div(classes)
{
	var div = document.createElement("div")
	div.classList.add(classes)
	div.addEventListener("load", function() {console.log("Hello");}) 
	return div
}

window.gameObject = game;

window.initGame = function()
{	
	/*var target = document.getElementById('target')
	var canvas = div("game-canvas")
	var gameWindow = div("game-window")
	var overlay = div("overlay")

	overlay.finishedLoading = false;
	//gameWindow.finishedLoading = false;
	//overlay.addEventListener("load",  function(){ console.log("Hello"); this.finishedLoading = true;  }) 
	//gameWindow.addEventListener("load", function() {console.log("Hello"); this.finishedLoading = true;}) 
	gameWindow.appendChild(div("paddle-left"))
	gameWindow.appendChild(div("paddle-right"))
	gameWindow.appendChild(div("pong-ball"))
	canvas.appendChild(gameWindow)
	canvas.appendChild(overlay)
	target.appendChild(canvas)*/
	//var target = document.getElementById('target')

	// console.log(target);
	if (typeof target !== 'undefined')
	{
		target.innerHTML = htmlContent();
		window.gameObject.startEngine();
	}
}
