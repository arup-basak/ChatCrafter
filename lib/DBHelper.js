// DBHelper.js

const mongoose = require('mongoose');
const ChatRoom = require('./models.roomSchema');
const Chat = require('./models.chatSchema');
const dot = require('dotenv').config()

const USERNAME = process.env.MONGO_USER
const PASSWORD = process.env.MONGO_PASS

// Connect to MongoDB

mongoose.connect(`mongodb+srv://${USERNAME}:${PASSWORD}@chatcrafter.hv9s5xz.mongodb.net/chatdb?retryWrites=true&w=majority`, {
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
      const chatRooms = await Chat.find();
      return chatRooms;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      throw error;
    }
  },

  getAllChats: async () => {
    try {
      const chats = await ChatRoom.find();
      return chats;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      throw error;
    }
  }
};

module.exports = DBHelper;
