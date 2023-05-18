const ChatRooms = require('./models.roomSchema'); //ChatRooms Data
const Chat = require('./models.chatSchema'); // Single ChatRoom Data
const db = require('./mongodb') // Implement MongoDB

const DBHelper = {
  createChatRoom: async (mUser, userId) => {
    const roomId = Math.random().toString(36).substring(2, 12);
    try {
      const data = {
        room: roomId,
        type: 'chat',
        users: [mUser, userId]
      };

      const chats = new ChatRooms(data);
      await chats.save();

      const chatData = {
        room: roomId
      }
      const chat = new Chat(chatData)
      await chat.save();

    } catch (error) {
      console.error('Error creating chat room:', error);
      throw error;
    }
  },

  getAllChatRooms: async () => {
    try {
      const chatRooms = await ChatRooms.find();
      return chatRooms;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      throw error;
    }
  },

  getAllChats: async () => {
    try {
      const chats = await Chat.find();
      return chats;
    } catch (error) {
      console.error('Error getting chat rooms:', error);
      throw error;
    }
  },


  updateChat: async (roomId, message, user) => {
    try {
      const room = roomId;
      const newMessage = {
        message: message,
        user: user
      };

      await Chat.findOneAndUpdate(
        { room },
        { $push: { chat: newMessage } },
        { new: true }
      );
    } catch (error) {
      console.log(error);
    }
  }
};

module.exports = DBHelper;
