const io = require('../../server').io;
const { messageController, authController, generateRoomId, chatController } = require('./controllers/socketController');

const onlineUsers = new Map(); // Map of user -> socketId

io.on('connect', (socket) => {
  // ==== Listen for the "register" event to associate a user with their socket
  socket.on('registerUser', async (userId) => {
    console.log(socket.id, userId)
    onlineUsers.set(userId, socket.id);
    // Notify that the user is online
    if (userId) {
      const result = await authController.updateUserConnectionStatus(userId, 'online');
      if (result) {
        socket.broadcast.emit('user-online', result)
      }
    }
  })
  // ======= END register listener ===========

  // ===== Listen for the "join-room" event to create/join a chat room =====
  socket.on('join-room', async ({ fromUserId, toUserId, chatId }) => {
    const roomId = generateRoomId(fromUserId, toUserId);
    // Socket join room
    socket.join(roomId);

    // Update the current change no read messages counter
    const updatedChatCounter = chatId && await chatController.resetChatCounter({ chatId });
    io.to(onlineUsers.get(fromUserId)).emit('updated-chat-counter', updatedChatCounter);

    // Update all messages to read messages
    const result = await messageController.updateMessagesStatusWithJoinRoom(fromUserId, toUserId);

    // Get the room size (number of connected clients in the room)
    const roomSize = io.sockets.adapter.rooms.get(roomId)?.size || 0;

    // Check if the sender is connected so we send the notification
    if (roomSize > 1) {
      // Check that result is not empty array
      if (result && result.length > 0) {
        // Here we send notification to the sender
        // (user that send message to this socket.id)
        // Broadcast the notification to other users in the room except the current socket
        socket.to(roomId).emit('partner-joined-room', result);
      }
    }
  });
  // ====== End Join room  listener ========

  // ===== Start listen to typing event =======
  socket.on('user-typing', (data) => {
    if (data.roomId) {
      socket.to(data.roomId).emit('notify-user-typing', data.typingStatus);
    }
  })
  // ======== END typing Listener ========

  // ==== Start liston to user-stop-typing event ======
  socket.on('user-stop-typing', (data) => {
    if (data.roomId) {
      socket.to(data.roomId).emit('notify-user-stop-typing', data.typingStatus);
    }
  });
  // ======== End stop typing listener ======

  // ===== Start listen for "message" events to broadcast messages in the room ====
  socket.on('send-message', async ({ roomId, message, toUserId, fromUserId }) => {
    // Check if the Receiver in the room or not and its connected
    // search for a room by its id
    const room = io.sockets.adapter.rooms.get(roomId);
    const receiverSocketId = onlineUsers.get(toUserId);
    // check if the toUser id socketId is in the room with id
    const receiverInRoom = room && room.has(receiverSocketId);

    // Update the message in the database (as "delivered")
    if (receiverInRoom) {
      console.log('Receiver is in room')
      // ===== Update chat counter when both users are in the room ====
      await chatController.resetChatCounter({ chatId: message.chat_id });

      // Update the message status in the DB
      const result = await messageController.updateMessageStatus(message.id, 'read', fromUserId);
      if (!result) {
        return;
      }
      // Notify the sender that the  receiver has read  the message
      io.to(roomId).emit('message-read', result);
    } else if (!receiverInRoom && onlineUsers.has(toUserId)) {
      // Connected receiver but not in the room
      // Update the message status in the DB
      const result = await messageController.updateMessageStatus(message.id, 'delivered', fromUserId);

      const updatedChatCounter = await chatController.updateChatCounter({ chatId: message.chat_id, fromUserId });
      console.log(updatedChatCounter, 'hello updated chat')
      // Notify the sender that the message delivered to partner that
      // not currently in the chat room
      io.to(roomId).emit('message-delivered', result);
      // Tell the receiver by its socketId, that there is a new messages
      // so display the new message as last message
      io.to(onlineUsers.get(toUserId)).emit('message-delivered-to-receiver', result);
      io.to(onlineUsers.get(toUserId)).emit('updated-chat-counter', updatedChatCounter);
    } else {
      // Disconnected receiver
      // If user not //
      console.log('Not connected user')
    }
  });
  // ===== End Message Event =====

  // ===== Start Leaving room listener =====
  socket.on('leave-room', ({ roomId, userId }) => {
    // console.log(roomId, userId)
    const socketByUserId = onlineUsers.get(userId);

    if (socketByUserId === socket.id) {
      socket.leave(roomId); // Remove socket from room with roomId
      io.to(roomId).emit('user-left', { userId, roomId }); // Notify other users in the room
    }
  })
  // ====== End leaving room event =======

  // === Start"disconnecting" event to access the rooms before the socket is removed
  socket.on('disconnecting', async () => {
    const socketId = socket.id;
    // Find the key corresponding to the value
    for (const [mapKey, mapValue] of onlineUsers.entries()) {
      if (mapValue === socketId) {
        // Notify that the user is offline
        const userId = mapKey;
        const result = await authController.updateUserConnectionStatus(userId, 'offline');
        if (result) {
          socket.broadcast.emit('user-offline', result);
        }

        // Remove from custom data structure
        onlineUsers.delete(mapKey);
        break;
      }
    }
    // ====== End disconnecting event ========
    // Check all rooms the socket is in and leave them
    socket.rooms.forEach(roomId => {
      socket.leave(roomId); // Ensure the socket leaves the rooms
      console.log(`Socket ${socketId} left room: ${roomId}`);

      // Check if the room is now empty and perform cleanup if needed
      const room = io.sockets.adapter.rooms.get(roomId);
      if (room && room.size === 0) {
        console.log(`Room ${roomId} is empty and can be cleaned up.`);
      }
    });
  });
  // ====== End  Connect section =====

  // ====== Start user disconnection  event =====
  socket.on('user_disconnected', async (data) => {
    const result = await authController.updateUserConnectionStatus(data.userId, 'offline');
    console.log(result);
    if (result) {
      // Emit only to OTHER users
      socket.broadcast.emit('user_status_changed', result);
    }
  });

  // ===== Start disconnect section =====
  socket.on('disconnect', (reason) => {
    console.log('User disconnected: ', socket.id, reason);
  });
  // ===== End disconnect section ===
})
