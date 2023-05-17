const chatarea = document.querySelector("#chat-area")

const socket = io(); // Initialization 

let currentRoom = "" //Room will update on change chat

const addMessage = (msg, side) => { // side --> boolean; true -> right, false -> left
    const elem = document.createElement('div');
    elem.classList.add('message', side ? 'message-right' : 'message-left');
    elem.innerText = msg;
    chatarea.appendChild(elem);    
}

const sendMessage = (msg) => {
    // addMessage(message, true);
    const date = new Date()
    const message = {
        time: date.toString(),
        msg: msg,
        room: currentRoom
    }
    socket.emit("chat message", message)
}

socket.on("message-to-user", (msg) => {
    addMessage(msg, false);
})