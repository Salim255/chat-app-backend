const socketio = require('socket.io');
const joinNamespace = require('./joinNamespace');
const Namespace = require('./classes/Namespace')

module.exports = socketServer = (expressServer) => {
  const io = socketio(expressServer);
  // Sockets will put into this array, in the index of their ns.id
  const namespaceSockets = {};
  const namespaces = [];

  io.on('connect', (socket) => {
    console.log('Socket connection  with success');
    socket.emit('Welcome', 'Welcome to the socket server ');

    socket.on('userTyping', (data) => {
      console.log(data);
    })

    socket.on('joinedConversation', (activeConversation) => {
      // Check weather namespace already in the namespaceSockets list
      let checkNs = namespaces.find(ns => {
        if (ns.id === activeConversation.id) return ns
        return 0;
      });

      // Build nameSpace
      if (!checkNs) {
        const newNs = new Namespace(activeConversation);
        namespaces[namespaces.length] = newNs;
        checkNs = newNs;
      }

      // Create namespace
      if (!namespaceSockets[checkNs.endpoint]) {
        namespaceSockets[checkNs.endpoint] = io.of(`${checkNs.endpoint}`);
      }
      // Join namespace
      joinNamespace.joinNamespace({ socket, namespaceSockets, namespaceEndpoint: checkNs.endpoint });
    })
  })
}
