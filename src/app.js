const express = require('express')
const app = express()
const userRouter = require('../src/views/userRouter')
const chatRouter = require('./views/chatRouter')
module.exports = () => {
  app.use(express.json())
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/chats', chatRouter)
  return app
}
