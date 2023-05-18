const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true
  },
  chat: [
    {
      message: {
        type: String,
        required: true
      },
      user: {
        type: String,
        required: true
      }
    }
  ]
});

const Chat = mongoose.model('room_data', chatSchema);

module.exports = Chat;
