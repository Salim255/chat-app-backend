const express = require('express')
const app = express()
const userRouter = require('../src/views/userRouter')
const chatRouter = require('./views/chatRouter')
const chatUserRouter = require('./views/chatUserRouter')
module.exports = () => {
  app.use(express.json())
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/chats', chatRouter)
  app.use('/api/v1/chat-users', chatUserRouter)
  return app
}
