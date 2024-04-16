require('dotenv').config()

const appConfig = require('./src/config/app')
const app = require('./src/app')
const pool = require('./src/config/pool')
const connectionOptions = require('./src/config/connection')

const PORT = appConfig.app_port || 4003

pool.connect(connectionOptions).then(() => {
  console.log('DB connection successful!')
})

const server = app().listen(PORT, () => {
  console.log('App running on port', PORT)
})

process.on('unhandledRejection', (err) => {
  console.log('ERROR NAME:=>', err.name, ' ERROR MESSAGE:=>', err.message)
  console.log('UNHANDLED REJECTION! 💥 Shutting down...')
  server.close(() => {
    process.exit(1)
  })
})
