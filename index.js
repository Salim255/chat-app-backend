require('dotenv').config()

const appConfig = require('./src/config/app')
const app = require('./src/app')
const pool = require('./src/config/pool')
const connectionOptions = require('./src/config/connection')
const socketio = require('socket.io');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED EXCEPTION! 💥 Shutting down...')
  console.log('ERROR NAME:=>', err.name, ' ERROR MESSAGE:=>', err.message)
  process.exit(1)
})

const PORT = appConfig.app_port || 4003

pool.connect(connectionOptions).then(() => {
  console.log('DB connection successful!')
})

const server = app().listen(PORT, () => {
  console.log('App running on port', PORT)
})

const io = socketio(server);
io.on('connect', (socket) => {
  console.log('Connection with success', socket);
})

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  console.log('ERROR NAME:=>', err.name, ' ERROR MESSAGE:=>', err.message)
  server.close(() => {
    process.exit(1)
  })
})
