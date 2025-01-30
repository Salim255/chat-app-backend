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
    // console.log(`User ${fromUserId} joined room: ${roomId}`);
  });

  // Listen for "message" events to broadcast messages in the room
  socket.on('send-message', async ({ roomId, message, toUserId, fromUserId }) => {
    // console.log(`Message sent to room ${roomId}: ${message.id}`);

    // Check if the Receiver in the room or not and its connected
    // search for a room by its id
    const room = io.sockets.adapter.rooms.get(roomId);
    // check if the toUser id socketId is in the room with id
    const receiverInRoom = room && room.has(onlineUsers.get(toUserId));

    // Update the message in the database (as "delivered")
    if (onlineUsers.has(toUserId)) {
      if (receiverInRoom && onlineUsers.has(toUserId)) {
        // Update the message status in the DB
        const result = await socketMessagesController.updateMessageStatus(message.id, 'read', fromUserId);
        if (!result) {
          return;
        }

        // Notify the message to sender & receiver as read message
        io.to(roomId).emit('message-read', result);
      } else {
        // Update the message status in the DB
        const result = await socketMessagesController.updateMessageStatus(message.id, 'delivered', fromUserId);
        console.log(result)
        if (!result) {
          return;
        }
        // Notify the message to sender as delivered message
        io.to(roomId).emit('message-delivered', result);

        // Send message notification to receiver by receiver socketId
        io.to(onlineUsers.get(toUserId)).emit('message-delivered-to-receiver', result)
      }
    }
  });

  // Use the "disconnecting" event to access the rooms before the socket is removed
  socket.on('disconnecting', () => {
    const socketId = socket.id;
    // Find the key corresponding to the value
    for (const [mapKey, mapValue] of onlineUsers.entries()) {
      if (mapValue === socketId) {
        onlineUsers.delete(mapKey); // Remove from custom data structure
        break;
      }
    }
  });

  socket.on('disconnect', (reason) => {
    console.log('User disconnected: ', socket.id);
  });
})

// Helper to generate a unique room ID for two users
function generateRoomId (user1, user2) {
  return [user1, user2].sort().join('-'); // Sort to ensure consistent room IDs
}
