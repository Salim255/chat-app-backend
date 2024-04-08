require('dotenv').config()

const appConfig = require('./src/config/app')
const app = require('./src/app')
const pool = require('./src/config/pool')
const connectionOptions = require('./src/config/connection')

const PORT = appConfig.app_port || 4003

pool.connect(connectionOptions).then(() => {
  app().listen(PORT, () => {
    console.log('App running on port', PORT)
  })
}).catch((err) => {
  console.log(err)
})
