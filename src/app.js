const express = require('express')
const app = express()
const userRouter = require('../src/views/userRouter')

app.use('/users', userRouter)

module.exports = app
