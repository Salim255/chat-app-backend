exports.joinNamespace = ({ socket, namespaceSockets, namespaceEndpoint }) => {
  namespaceSockets[namespaceEndpoint].on('connection', (nsSocket) => {
    nsSocket.on('typing', () => {
      nsSocket.broadcast.emit('typingServer', {
        socketId: nsSocket.id,
        type: 'typing'
      }
      )
    });

    nsSocket.on('stopTyping', () => {
      nsSocket.broadcast.emit('stopTypingServer', {
        socketId: nsSocket.id,
        type: 'stopTyping'
      })
    });

    nsSocket.on('sentMessage', (data) => {
      // Send notification to the receiver
      nsSocket.broadcast.emit('emittingSentMessage', {
        socketId: nsSocket.id,
        partnerId: data.partnerId,
        chatId: data.chatId
      })
    })
  })
  socket.emit('joinedNamespace', { namespace: namespaceEndpoint })
}
