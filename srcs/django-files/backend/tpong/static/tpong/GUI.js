import { Util } from "./Util.js"
import { Color } from "./Color.js";


class CenterText
{
	constructor()
	{
		this.overlay = null;
		this.obj = null;
		this.inserted = false;
	}

	create()
	{
		var dimensions = this.overlay.getBoundingClientRect()
		if (dimensions.height < 1)
		{
			return false
		}
		this.obj = document.createElement("span");
		this.obj.obj = this;
		this.fontSize = Math.floor(dimensions.height / 5)
		this.obj.id = "centerText"
		this.obj.style.position = "absolute";
		this.obj.style.top = "50%";
		this.obj.style.left = "50%";
		this.obj.style.transform = "translate(-50%, -50%) scale(1)";
		this.obj.style.textAlign = "center";
		this.obj.style.color = new Color(255,255,255).toRgbCss()
		this.obj.style.fontSize = `${this.fontSize}px`
		this.obj.style.fontWeight = "bold"
		this.obj.style.transition = "all 1s"
		return true;
	}

	insert()
	{
		this.overlay = Util.getOverlayHtmlObject();
		if(!this.create())
		{
			this.inserted = false;
			return false
		}	
		this.overlay.appendChild(this.obj)
		this.inserted = true;
		return true
	}

	setCountdownContent(content)
	{
		this.obj.textContent = content
		this.obj.style.transition = "all 1s"
		this.obj.style.transform = "translate(-50%, -50%) scale(0)";
		setTimeout(function(){
			this.obj.textContent = ""
			this.obj.style.transition = "";
			this.obj.style.transform = "translate(-50%, -50%) scale(1)";
		}.bind(this), 900)
	}

	setText(text, drawTime)
	{
		this.obj.textContent = content
		this.obj.style.transition = "";
		this.obj.style.transform = "translate(-50%, -50%) scale(1)";
		this.obj.textContent = text
		if (drawTime > 1)
		{
			setTimeout(function(){
				this.obj.textContent = ""
			}.bind(this), drawTime)
		}
	}

	update()
	{
		if (!this.inserted)
			this.insert()
	}
};

export class Overlay
{
	constructor()
	{
		this.obj = null;
		this.created = false;
		this.activeElements = []
	}
	
	getElementById(id)
	{
		return document.getElementById(id)
	}
	
	create()
	{
		this.created = true;
		this.obj = Util.getOverlayHtmlObject();
		this.activeElements.push(new CenterText(this.obj))
	}

	load()
	{
		if (!this.created)
			this.create();
		for (var i = 0; i < this.activeElements.length; i++)
			this.activeElements[i].insert()
	}

	startCountdown(seconds = 3)
	{
		var centerText = this.getElementById("centerText")
		if (!centerText)
			return
		seconds -= 1
		var countdown = setInterval(() => {
			if (seconds < 0)
			{
				clearInterval(countdown);
				centerText.obj.setCountdownContent("");
			}
			else if(seconds == 0)
				centerText.obj.setCountdownContent("GO!");
			else
				centerText.obj.setCountdownContent(seconds);
			seconds -= 1;
		}, 1000);
	}

	setText(text)
	{
		var centerText = this.getElementById("centerText")
		if (!centerText)
			return
		centerText.obj.setText(text)
	}

	syncDOM()
	{
		if (!this.created)
			this.create();
		for (var i = 0; i < this.activeElements.length; i++)
			this.activeElements[i].update()
	}
}
/*
export class GUI
{
	constructor(str)
	{
		this.string = str;
		setTimeout(()=>{
			this.onPrepNextRound(5);
		}, 500)
	}

	setString(str)
	{
		this.string = str;
	}

	onPrepNextRound(seconds = 3)
	{
		var overlay = Util.getOverlayHtmlObject();
		var countdown = setInterval(function(){
		if (seconds < 0)
		{
			clearInterval(countdown);
			overlay.innerHTML = "";
		}
		else if(seconds == 0)
			overlay.innerHTML = "GO!";
		else
			overlay.innerHTML = seconds + " seconds remaining";
		seconds -= 1;
		}, 1000);
	}

	onStateChange(state, seconds = 0)
	{
		if (state == 'prep_next_round')
			countdown(seconds);
	}

	onWaiting()
	{
		var overlay = Util.getOverlayHtmlObject();
		overlay.innerHTML = "Waiting for opponent";
	}

	onGameStart(seconds = 2)
	{
		var overlay = Util.getOverlayHtmlObject();
		var interval = setInterval(function(){
			if (seconds == 0)
			{
				clearInterval(interval);
				overlay.innerHTML = "";
			}
			else
				overlay.innerHTML = "Have fun :)";
			seconds -= 1;
		}, 1000);
	}

	onCustomText(string, seconds = 3)
	{
		var overlay = Util.getOverlayHtmlObject();
		var interval = setInterval(function(){
			if (seconds == 0)
			{
				clearInterval(interval);
				overlay.innerHTML = "";
			}
			else
				overlay.innerHTML = string;
			seconds -= 1;
		}, 1000);
	}

	syncDOM()
	{
		// const box = Util.getOverlayHtmlObject();
		// box.innerHTML = "<p>" + this.string + "</p>";
	}
}*/