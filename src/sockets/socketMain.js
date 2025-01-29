const io = require('../../server').io;
const socketMessagesController = require('./controllers/socketMessagesController');

const onlineUsers = new Map(); // Map of user -> socketId

io.on('connect', (socket) => {
  // Listen for the "register" event to associate a user with their socket
  socket.on('registerUser', userId => {
    console.log(`User registered: ${userId}`);
    onlineUsers.set(userId, socket.id);

    // Notify that the user is online
    socket.broadcast.emit('user-online', userId)
  })

  // Listen for the "join-room" event to create/join a chat room
  socket.on('join-room', ({ fromUserId, toUserId }) => {
    const roomId = generateRoomId(fromUserId, toUserId);
    console.log(roomId)
    socket.join(roomId);
    console.log(`User ${fromUserId} joined room: ${roomId}`);
  });

  // Listen for "message" events to broadcast messages in the room
  socket.on('send-message', ({ roomId, messageId, toUserId, fromUserId }) => {
    console.log(`Message sent to room ${roomId}: ${messageId}`);

    // Emit message to the room
    io.to(roomId).emit('receive-message', messageId);

    // Update the message in the database (as "delivered")
    if (onlineUsers.has(toUserId)) {
      // Update the message status in the DB
      const result = socketMessagesController.markMessageAsDelivered(messageId, 'delivered', fromUserId);
      if (!result) {
        return;
      }
      // Notify sender
      io.to(roomId).emit('message-delivered', messageId);
    }
  });

  socket.on('disconnect', (reasons) => {
    console.log('User disconnected', reasons);
  });
})

// Helper to generate a unique room ID for two users
function generateRoomId (user1, user2) {
  return [user1, user2].sort().join('-'); // Sort to ensure consistent room IDs
}
