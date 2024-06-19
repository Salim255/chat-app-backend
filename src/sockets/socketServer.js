const socketio = require('socket.io');

module.exports = socketServer = (expressServer) => {
  const io = socketio(expressServer);
  // Sockets will put into this array, in the index of their ns.id
  // Keep track of connected users
  const connectedUsers = new Map();

  io.on('connect', (socket) => {
    console.log('A user connected', socket.id);

    // Handle user identification and message status updates
    socket.on('user_connected', (userId) => {
      console.log('User connect', userId);
      // Check if user is already connected
      if (!connectedUsers.has(userId)) {
        // Add user to the connected users list
        connectedUsers.set(userId, socket.id);

        // Join the user to their personal room
        socket.join(userId);
      } else {
        connectedUsers.set(userId, socket.id)
      }
    })

    // Handle user typing
    socket.on('user_typing', (data) => {
      console.log('Typing....', data);
      const { toUserId } = data;
      io.to(toUserId).emit('typing_message', { status: data.status });
    });

    // Handle sending messages
    socket.on('send_message', async (data) => {
      const { toUserId } = data;

      // Emit 'message_sent' event to the sender
      socket.emit('message_sent', data);

      // Emit 'new_message'  event To tell the recipient
      // console.log(toUserId, "Fuc you user");
      io.to(toUserId).emit('new_message', data);
    });

    // Handle message deliver
    socket.on('delivered_message', (data) => {
      const { toUserId, fromUserId } = data
      // Emit message_delivered modify_message_status
      io.to(toUserId).emit('message_delivered_with_modify_fetch_messages', data);

      // To the sender
      io.to(fromUserId).emit('message_delivered_with_fetch_messages', data);
    });

    // Handle message read
    socket.on('read_message', (data) => {
      const { toUserId } = data
      // Emit message_read to modify message status to read, by the receiver
      io.to(toUserId).emit('message_read', data)
    })

    socket.on('display_message_read', (data) => {
      const { fromUserId } = data
      io.to(fromUserId).emit('display_read_message', data)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected');
    /*   for (const userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
          console.log(`User ${userId} disconnected`);
          break;
        }
      } */
    });
  })
}
