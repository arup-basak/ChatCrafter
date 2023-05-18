// DBHelper.js

const mongoose = require('mongoose');
const ChatRoom = require('./models');

// Connect to MongoDB
mongoose.connect('mongodb+srv://hackathon:YDQrYLWjIEWJvVlx@chatcrafter.hv9s5xz.mongodb.net/?retryWrites=true&w=majority', {
  dbName: 'chatdb',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const DBHelper = {
  saveChatRoom: async (chatRoomData) => {
    try {
      const chatRoom = new ChatRoom(chatRoomData);
      const savedChatRoom = await chatRoom.save();
      console.log('Chat room saved:', savedChatRoom);
      return savedChatRoom;
    } catch (error) {
      console.error('Error saving chat room:', error);
      throw error;
    }
  },

  getAllChatRooms: async () => {
    try {
      const chatRooms = await ChatRoom.find();
      console.log('All chat rooms:', chatRooms);
      return chatRooms;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      throw error;
    }
  }
};

module.exports = DBHelper;
