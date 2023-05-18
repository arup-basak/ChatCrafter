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

// Middleware to check login status
const checkLogin = (req, res, next) => {
  const data = myCache.get('userkey');
  if (data.username.length > 0 && data.password.length > 0) {
    next(); // User logged in, proceed to the next middleware/route handler
  } else {
    res.redirect('/login'); // User not logged in, redirect to login page
  }
};

// Route for the homepage
app.get('/', checkLogin, (req, res) => {
  res.redirect('/chat');
});

app.get('/chat', checkLogin, (req, res) => {
  res.sendFile(__dirname + '/public/chat.html');
});

app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/savecache', (req, res) => {
  const { username, password } = req.query;
  if (username.length > 0 && password.length > 0) {
    cache.username = username;
    cache.password = password;
    myCache.set('userkey', cache, 2592000);
    res.redirect('/chat');
  } else {
    res.redirect('/login');
  }
});

app.get('/whoami', (req, res) => {
  res.json({ user: myCache.get('userkey') });
});

app.get('/chatdata', async (req, res) => {
  try {
    const chatRooms = await DBHelper.getAllChatRooms();
    res.json(chatRooms);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chat rooms.' });
  }
});

app.get('/getchat', async (req, res) => {
  const { room } = req.query;
  try {
    const chats = await DBHelper.getAllChats();
    const chat = chats.find(item => item.room === room);

    if (chat) {
      res.json(chat);
    } else {
      res.status(404).json({ error: "Chat not found" });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to get chat.' });
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
  });

  // Handle chat message event
  socket.on('chat message', (msg) => {
    console.log(msg);
    io.to(msg.room).emit("message-to-user", msg);
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
