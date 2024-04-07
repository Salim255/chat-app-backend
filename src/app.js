const express = require('express')
const app = express()
const userRouter = require('../src/views/userRouter')

module.exports = () => {
  app.use(express.json())
  app.use('/api/v1/users', userRouter)
  return app
}
