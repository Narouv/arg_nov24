import "/static/webclient/setup.js"

window.revealChat = function() {
    document.getElementById("chatWindow").style.display = "inline-block";
    document.getElementById("accessBtn").hidden = true;
    // document.getElementById("secretNotes").hidden = false;
    document.getElementById("secretDiv").hidden = false;
    const chatLines = document.querySelectorAll(".chat-line");
    let delay = 0;

    chatLines.forEach((line) => {
        setTimeout(() => {
        line.style.opacity = 1; // Zeile wird sichtbar
        }, delay);
        delay += 1500; // 2 Sekunden Pause zwischen den Zeilen
    });
}

window.checkPassword = async function()
{
    var passwordInput = document.getElementById("passwordBox");
    var isCorrect = document.getElementById("correctnessIndicator");
    const instructionsContainer = document.getElementById("instructionsContainer");

    var res = await api.post('/api/auth/checkpass/', { input: passwordInput.value }, { noauth: true })
    if (res.success)
    {
        instructionsContainer.style.display = "block";
        isCorrect.innerText = "Correct!";
        return;
    }
    isCorrect.innerText = "Wrong!";
    passwordInput.value = "";
}
