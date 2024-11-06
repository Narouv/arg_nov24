
window.login = async function (un)
{
	var username = null, password = null;

	// TODO: Retrieve User Credential
	username = "root"
	password = "test"
	const result = await window.api.login(un, password)
	if (!result.success)
	{
		console.log("Login failed!")
	}
}

window.logout = async function()
{
	window.api.logout()
}

window.testStuff = async function()
{
	var data = await window.api.post("/api/test/", null);
	console.log(data);
}

window.matchmaking = async function(type)
{
	var data = await window.api.post(`/api/pong/matchmaking/register/${type}/`,{});
	console.log(data);
}
