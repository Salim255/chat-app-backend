const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

module.exports = {
  host: process.env.DB_TEST_HOST,
  port: process.env.DB_TEST_PORT,
  database: process.env.DB_TEST_DATABASE,
  user: process.env.DB_TEST_USER,
  password: process.env.DB_TEST_PASSWORD
}
