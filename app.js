const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const msgData = [
  {
    room: "aguisfff",
    type: "chat",
    users: ['arup', 'S Das']
  },
  {
    room: "fgyabkjdc",
    type: "chat",
    users: ['A Ranjan', 'arup']
  },
  {
    room: "yfagkhcn",
    type: "chat",
    users: ['arup', 'S Ghosh']
  }
];


// Serve static files from the "public" directory
app.use(express.static('public'));

// Route for the homepage
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/chatdata', (req, res) => {
  res.send(msgData);
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
