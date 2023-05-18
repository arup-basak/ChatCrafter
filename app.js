const express = require('express');
const NodeCache = require("node-cache");
const DBHelper = require('./lib/DBHelper');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const myCache = new NodeCache();
const cache = {
  username: "",
  password: ""
};

// Serve static files from the "public" directory
app.use(express.static('public'));

// Route for the homepage
app.get('/', (req, res) => {
  const data = myCache.get('userkey');
  if (data.username > 0 && data.password > 0) {
    // Login Check
    res.redirect('/chat')
  }
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/chat', (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

app.get('/savecache', (req, res) => {
  const { username, password } = req.query;
  if (username.length > 0 && password.length > 0) {
    cache.username = username;
    cache.password = password;
    myCache.set('userkey', cache, 2592000);
    res.redirect('/chat')
  }
  req.redirect('/login')
})

app.get('/whoami', (req, res) => {
  res.json({ user: myCache.get('userkey') })
})

app.get('/chatdata', async (req, res) => {
  try {
    const chatRooms = await DBHelper.getAllChatRooms();
    res.json(chatRooms)
  }
  catch {
    res.status(500).json({ error: 'Failed to get chat rooms.' });
  }
});

// get total chat as JSON whan 
app.get('/getchat', async (req, res) => {
  const { room } = req.query;
  const chats = await DBHelper.getAllChats()
  const chat = chats.find(item => item.room === room)

  if (chat) {
    res.json(chat);
  } else {
    res.status(404).json({ error: "Chat not found" });
  }
});


// Socket.IO connection event
io.on('connection', (socket) => {
  console.log(`A user connected`);

  socket.on('join', (rooms) => {
    const roomsArr = rooms.split(",")

    roomsArr.forEach((room) => {
      socket.join(room)
    });
  })

  // Handle chat message event
  socket.on('chat message', (msg) => {
    console.log(msg)
    io.to(msg.room).emit("message-to-user", msg)
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Start the server
const port = 3000;
http.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
