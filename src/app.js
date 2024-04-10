const express = require('express')
const app = express()

const userRouter = require('../src/views/userRouter')
const chatRouter = require('./views/chatRouter')
const chatUserRouter = require('./views/chatUserRouter')
const messageRouter = require('./views/messageRouter')
const postRouter = require('./views/postRouter')
const commentRouter = require('./views/commentRouter')
const reactionRouter = require('./views/reactionRouter')

module.exports = () => {
  app.use(express.json())
  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/chats', chatRouter)
  app.use('/api/v1/chat-users', chatUserRouter)
  app.use('/api/v1/messages', messageRouter)
  app.use('/api/v1/posts', postRouter)
  app.use('/api/v1/comments', commentRouter)
  app.use('/api/v1/reactions', reactionRouter)
  return app
}
