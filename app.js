const express = require('express');
const DBHelper = require('./lib/DBHelper');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const chats = [
  {
    room: "aguisfff",
    type: "chat",
    chat: [
      {
        message: "Hello How are you",
        user: "S Das"
      },
      {
        message: "I'm fine",
        user: "arup"
      },
      {
        message: "That's great to hear!",
        user: "S Das"
      },
      {
        message: "By the way, have you seen the latest movie?",
        user: "S Das"
      },
      {
        message: "No, I haven't. Is it any good?",
        user: "arup"
      }
    ]
  },
  {
    room: "fgyabkjdc",
    type: "chat",
    chat: [
      {
        message: "Hi, everyone!",
        user: "A Ranjan"
      },
      {
        message: "Hey! How's it going?",
        user: "arup"
      },
      {
        message: "I'm doing well. Thanks for asking!",
        user: "A Ranjan"
      }
    ]
  },
  {
    room: "yfagkhcn",
    type: "chat",
    chat: [
      {
        message: "Hey, arup!",
        user: "S Ghosh"
      },
      {
        message: "Hello! What's up?",
        user: "arup"
      },
      {
        message: "Not much. Just working on a project.",
        user: "S Ghosh"
      },
      {
        message: "That sounds interesting. Tell me more about it.",
        user: "arup"
      }
    ]
  }
];



// Serve static files from the "public" directory
app.use(express.static('public'));

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chatdata', async (req, res) => {
  try {
    const chatRooms = await DBHelper.getAllChatRooms();
    res.json(chatRooms)
  }
  catch {
    res.status(500).json({ error: 'Failed to get chat rooms.' });
  }
  // res.json(msgData);
});

// get total chat as JSON whan 
app.get('/getchat', (req, res) => {
  const { room } = req.query;
  const chatData = chats.find(chat => chat.room === room);
  
  if (chatData) {
    res.json(chatData);
  } else {
    res.status(404).json({ error: "Chat room not found" });
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
