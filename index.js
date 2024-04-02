require('dotenv').config()

const appConfig = require('./src/config/app')
const app = require('./src/app')

const PORT = appConfig.app_port
app.listen(PORT, () => {
  console.log('App running on port', 4003)
})
