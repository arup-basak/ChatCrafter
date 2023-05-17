const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    room_id: {
        type: String,
        required: true
    },

    Users: {
        type: String,
        required: true
    }
})