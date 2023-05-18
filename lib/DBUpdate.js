const ChatRoom = require('./models.roomSchema');
const db = require('./mongodb')

const insertChatRoom = (userId, mUserId) => {
    try {
        const mRoom = new ChatRoom({
            room: Math.random().toString(36).substring(2, 12),
            type: 'chat',
            users: [userId, mUserId]
        });

        mRoom.save((err) => {
            if (err)
                throw err;
        });
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = insertChatRoom