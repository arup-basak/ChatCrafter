const chatarea = document.querySelector("#chat-area")
const chatsElem = document.querySelector("#chats")
let chatItems = []

const socket = io(); // Initialization 

let currentRoom = "" //Room will update on change chat
let userId = "arup"

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
        message: msg,
        room: currentRoom
    }
    socket.emit("chat message", message)
}

socket.on("message-to-user", (msg) => {
    // addMessage(msg.message, false);
    console.log(msg)
})

fetch('/chatdata')
.then(response => response.json())
.then(data => {
    data.forEach(item => {
            const elem = document.createElement('div');
            elem.classList.add('chat-container')
            elem.setAttribute('id', item.room);
            if(item.type === 'chat') {
                elem.innerText = item.users[0] === userId ? item.users[1] : item.users[0];
            }
            else if(item.type === 'group') {
                // TODO
            }

            elem.onclick = () => {
                currentRoom = item.room
                fetch(`/getchat?room=${item.room}`)
                    .then(response => response.json())
                    .then((item) => {
                        const chats = item.chat;
                        if(item.type === 'chat'){
                            chatarea.innerHTML = ""
                            chats.forEach((msg) => {
                                addMessage(msg.message, msg.user === userId)
                            })
                        }
                    })
            }

            chatsElem.appendChild(elem);
        });

        chatItems = document.querySelectorAll('chat-container')
    })