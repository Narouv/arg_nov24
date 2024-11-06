
function addScript( src ) {
	var s = document.createElement( 'script' );
	s.setAttribute( 'src', src );
	s.setAttribute( 'type', 'module');
	document.head.appendChild( s );	
}


async function loadGame()
{
	addScript("/static/tpong/pong-game.js")
	target = document.getElementById('target');
	// console.log(target);
	if (target != undefined)
		target.innerHTML = htmlContent();
}

loadGame()