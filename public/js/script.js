const input = document.querySelector("#message-bar");
const sendButton = document.querySelector("#send-button");

addInput.style.display = 'none'

const send = () => {
    if(input.value.length != 0) {
        sendMessage(input.value)
        input.value = ""
    }
}

const closeNewRoomInput = () => {
    addInput.value = ""
    addInput.style.display = 'none'
    addButton.style.display = 'block'
}

sendButton.addEventListener("click", () => {
    send()
})

input.addEventListener("keypress", (e) => {
    if(e.key == "Enter")
    send()
})

addButton.addEventListener('click', () => {
    addButton.style.display = 'none'
    addInput.style.display = 'block'
})

addInput.addEventListener('keypress', (e) => {
    if(e.key === 'Enter') {
        if(addInput.value.length > 0) {
            newChat(addInput.value)
        }
        closeNewRoomInput()
    }
})

document.onkeydown = function(evt) {
    evt = evt || window.event;
    var isEscape = false;
    if ("key" in evt) {
        isEscape = (evt.key === "Escape" || evt.key === "Esc");
    } else {
        isEscape = (evt.keyCode === 27);
    }
    if (isEscape) {
        closeNewRoomInput()
    }
};