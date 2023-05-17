const input = document.querySelector("#message-bar");
const sendButton = document.querySelector("#send-button");

const send = () => {
    sendMessage(input.value)
    input.value = ""
}

sendButton.addEventListener("click", () => {
    send()
})

input.addEventListener("keypress", (e) => {
    if(e.key == "Enter")
        send()
})