const express = require('express');
const NodeCache = require("node-cache");
const DBHelper = require('./lib/DBHelper');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

// const { insertChatRoom } = require('./lib/DBHelper');

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
  try {
    if (data.username.length > 0 && data.password.length > 0) {
      next(); // User logged in, proceed to the next middleware/route handler
    } else {
      res.redirect('/'); // User not logged in, redirect to login page
    }
  }
  catch {
    res.redirect('/'); // User not logged in, redirect to login page
  }
};

// Route for the homepage
app.get('/', checkLogin, (req, res) => {
  res.redirect('/chat');
});

app.get('/chat', checkLogin, (req, res) => {
  res.sendFile(__dirname + '/public/chat.html', { name: "arup" });
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
  res.json(myCache.get('userkey'));
});

app.get('/createchat', (req, res) => {
  const { user } = req.query;
  const b = new DBHelper.insertChatRoom(user, cache.username);

  res.json({ 'response': b })
})

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
    const roomChat = chats.find(item => item.room === room);

    if (roomChat) {
      res.json(roomChat);
    } else {
      res.status(404).json({ error: "Chat not found for the specified room" });
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
    socket.join(msg.room)
    if (msg.room === `${cache.username}AI-CHAT`) {
      AI(msg.room, msg.message)
    }
    DBHelper.updateChat(msg.room, msg.message, msg.user)
    io.to(msg.room).emit("message-to-user", msg);
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });

  socket.on('create-room', (msg) => {
    DBHelper.createChatRoom(cache.username, msg.username);
  })


  // AI CONTENT

  const chat_history = []
  const AI = (room, question) => {
    socket.join(room)
    fetch(process.env.WRITESONIC_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive',
        'Content-Type': 'application/json',
        'User-Agent': 'python-requests/2.28.1',
        'accept': 'application/json',
        'token': process.env.WRITESONIC_API_TOKEN
      },
      body: JSON.stringify({
        'question': question,
        'chat_history': chat_history
      })
    })
      .then(response => response.json())
      .then((elem) => {
        console.log(elem)
        socket.emit('AI reply', elem[elem.length-1].data.answer)
      })
      .catch((e) => {
        console.log(e)
      })
  }
});

// Start the server
const port = 3000;
http.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});