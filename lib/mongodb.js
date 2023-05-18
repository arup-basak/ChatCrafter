const mongoose = require('mongoose');
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

module.exports = db;