const input = document.querySelector("#message-bar");
const sendButton = document.querySelector("#send-button");

addInput.style.display = 'none'

const send = () => {
    if(input.value.length != 0) {
        sendMessage(input.value)
        input.value = ""
    }
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
        newChat(addInput.value)
        addInput.value = ""
        addInput.style.display = 'none'
        addButton.style.display = 'block'
    }
})