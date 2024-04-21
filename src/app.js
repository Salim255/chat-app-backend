const dotenv = require('dotenv')
const express = require('express')
const app = express()
const cors = require('cors')
const morgan = require('morgan')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')

const userRouter = require('../src/views/userRouter')
const chatRouter = require('./views/chatRouter')
const chatUserRouter = require('./views/chatUserRouter')
const messageRouter = require('./views/messageRouter')
const postRouter = require('./views/postRouter')
const commentRouter = require('./views/commentRouter')
const reactionRouter = require('./views/reactionRouter')

dotenv.config({ path: '../.env' })

module.exports = () => {
  app.use(cors())
  app.use(express.json())

  if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

  app.use('/api/v1/users', userRouter)
  app.use('/api/v1/chats', chatRouter)
  app.use('/api/v1/chat-users', chatUserRouter)
  app.use('/api/v1/messages', messageRouter)
  app.use('/api/v1/posts', postRouter)
  app.use('/api/v1/comments', commentRouter)
  app.use('/api/v1/reactions', reactionRouter)

  // Error handling
  app.use('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
  })

  app.use(globalErrorHandler)
  return app
}
