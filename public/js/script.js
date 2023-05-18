const input = document.querySelector("#message-bar");
const sendButton = document.querySelector("#send-button");

const send = () => {
    if(input.value.length != 0) {
        console.log('sending')
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