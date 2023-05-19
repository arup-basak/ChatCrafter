const chatarea = document.querySelector("#chat-area")
const chatsElem = document.querySelector("#chats")
const addButton = document.querySelector('#add-button')
const addInput = document.querySelector('.add-input')

let chatItems = []

const socket = io(); // Initialization 

let currentRoom = "" //Room will update on change chat
let userId = ""

const addMessage = (msg, side) => { // side --> boolean; true -> right, false -> left
    const elem = document.createElement('div');
    elem.classList.add('message', side ? 'message-right' : 'message-left');
    elem.innerText = msg;
    chatarea.appendChild(elem);    
}

const sendMessage = (msg) => {
    const date = new Date()
    const message = {
        user: userId,
        time: date.toString(),
        message: msg,
        room: currentRoom
    }
    socket.emit("chat message", message)
}

const newChat = (userid) => {
    socket.emit('create-room', {username: userid})
}

socket.on("message-to-user", (msg) => {
    addMessage(msg.message, false);
})

const hiddenDiv = document.querySelector(".hidden")

fetch('/whoami')
.then(response => response.json())
.then(data => {
    userId = data.username
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
                fetch(`${window.location.origin}/getchat?room=${item.room}`)
                    .then(response => response.json())
                    .then((item) => {
                        console.log(item)
                        const chats = item.chat;
                        if(item.type === 'chat') {
                            chatarea.innerHTML = ""
                            chats.forEach((msg) => {
                                addMessage(msg.message, msg.user === userId)
                            })
                        }
                    }).catch((e) => {
                        console.log(e)
                    })
                    
            }

            chatsElem.appendChild(elem);
        });

        chatItems = document.querySelectorAll('chat-container')
    })