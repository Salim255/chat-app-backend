exports.joinNamespace = ({ socket, namespaceSockets, namespaceEndpoint }) => {
  namespaceSockets[namespaceEndpoint].on('connection', (socket) => {
    console.log("Hello bien conncteded ⛑️⛑️", socket.id, namespaceEndpoint);
  })
  socket.emit('joinedNamespace', { namespace: namespaceEndpoint })
}
