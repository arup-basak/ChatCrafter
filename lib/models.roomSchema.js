// Import the required dependencies
const mongoose = require('mongoose');

// Define the chat schema
const chatSchema = new mongoose.Schema({
  room: String,
  type: String,
  chat: [{
    message: String,
    user: String
  }]
});

// Create and export the Chat model
module.exports = mongoose.model('chat_data', chatSchema);
