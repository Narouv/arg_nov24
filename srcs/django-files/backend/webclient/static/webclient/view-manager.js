import "/static/webclient/setup.js"
import { NavbarManager } from '/static/webclient/navbar.js';

export class ViewManager
{
	constructor()
	{
		this.navbarBox = document.getElementById("navbar");
		this.contentBox = document.getElementById("content");
		this.views = {};
		this.views["login"] = 		{ perm: 0,  onLoad: null }
		this.views["register"] = 	{ perm: 0,  onLoad: null }
		this.views["home"] = 		{ perm: 1,  onLoad: () => {
			if (window.gameObject)
				window.initGame()
		}}
		this.views["game-active"] = { perm: 2,  onLoad: () => {
			if (window.gameObject)
			{
				gameManager.onViewLoad()
			}
		}}
		this.views["gameselection"] = { perm: 2,  onLoad: async () => {
			if (window.gameObject)
			{
				if (await gameModeManager.getActiveLobby())
					viewManager.getPage("game-active", null, false)
			}
		}}
		this.views["profile"] = 	{ perm: 2,  onLoad: () => {
			window.friendManager.load()
		}}
		this.views["settings"] = 	{ perm: 2,  onLoad: null}
		this.views["match-result"] = 	{ perm: 2,   onLoad: () => {
		//	gameManager.loadMatchResult()
		}}
		this.views["setup-2FA"] = 	{ perm: 2,   onLoad: () => {
			profileSettings.start2faSetup()
		}}
		window.addEventListener("popstate", this.historyManager);
	}

	async getPage(page, args, addToHistory = true)
	{
		if (page === "")
			page = "home";

		var view = this.views[page]
		var authenticated = await api.verifyAuthenticated()

		if (((view && view.perm == 0) && authenticated) ||
			((!view && !authenticated) || (!authenticated && (view && view.perm > 1))))
		{
			page = "home";
			view = this.views[page]
		}

		var viewData = await api.post(`/views/${page}/`, { args: args }, { type: "text" })

		if (window.gameObject && page != "pong")
			window.gameObject.stopEngine()

		this.contentBox.innerHTML = viewData

		if (addToHistory)
			window.history.pushState({ 'content': viewData, 'pong': (page == "pong") ? true : false }, "", `#${page}`);

		if (view)
		{
			if (view.onLoad)
				view.onLoad()
		}

		return;
	}

	async getNavbar()
	{
		this.navbarBox.innerHTML = await api.post("/views/navbar/", null,  { type: "text" });

		/*const links = document.getElementsByClassName('nav-link');
		for(let i = 0; i < links.length; i++)
		{
			links[i].addEventListener('click', function(event) {
				if (event.target.innerHTML != "logout")
					event.preventDefault();
				this.getPage(links[i].href.split('/').pop());
			}.bind(this), false);
		}*/
	}

	historyManager(s)
	{
		this.contentBox = this.document.getElementById("content");
		if (s.state != null)
		{
			if (!('pong' in s.state) || !s.state.pong)
				this.window.gameObject.stopEngine();
			contentBox.innerHTML = s.state.content;
			if (s.state.pong)
				this.window.initGame();
		}
		else
		{
			contentBox.innerHTML = "";
			this.window.gameObject.stopEngine();
		}
	}

	currentView()
	{
		return window.location.hash.split('#').pop()
	}

	onLoad() {
		// console.log("onLoad");
		this.getNavbar().then(() => {
			const navbarElement = document.getElementById("MainNavbar-Itemlist");
			// const navbarElement = document.getElementsByClassName("interactive-navbar")[0];
			const navbarManager = new NavbarManager(navbarElement);

			navbarManager.onResize();
			this.getPage(this.currentView());
		});
	}
}

window.viewManager = new ViewManager()

document.addEventListener('DOMContentLoaded', () => {
	window.viewManager.onLoad()
});

if (document.readyState != 'loading')
	window.viewManager.onLoad()

