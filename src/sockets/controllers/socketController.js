const authController = require('../../controllers/authController');
const messageController = require('../../controllers/messageController');
const chatController = require('../../controllers/chatController');
const sessionController = require('../../controllers/sessionController')
// Helper to generate a unique room ID for two users
function generateRoomId (user1, user2) {
  return [user1, user2].sort().join('-'); // Sort to ensure consistent room IDs
}

module.exports = {
  authController,
  messageController,
  chatController,
  sessionController,
  generateRoomId
}
