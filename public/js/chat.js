const chatarea = document.querySelector("#chat-area")

const socket = io(); // Initialization 

const addMessage = (msg, side) => { // side --> boolean; true -> right, false -> left
    const elem = document.createElement('div');
    elem.classList.add('message', side ? 'message-right' : 'message-left');
    elem.innerText = msg;
    chatarea.appendChild(elem);    
}

const sendMessage = (message) => {
    addMessage(message, true);
    socket.emit("chat message", message)
}

socket.on("message-to-user", (msg) => {
    addMessage(msg, false);
})