// Room Datas

// Import the required dependencies
const mongoose = require('mongoose');

// Define the chat schema
const chatSchema = new mongoose.Schema({
  room: String,
  type: String,
  users: {
    type: [String],
    required: true
  }
});

// Create and export the Chat model
module.exports = mongoose.model('room_data', chatSchema);
