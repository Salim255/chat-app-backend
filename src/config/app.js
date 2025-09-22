const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

const appConfig = {
  app_port: process.env.APP_PORT
}

module.exports = appConfig
