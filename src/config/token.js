const path = require('path')
const dotenv = require('dotenv')
dotenv.config({ path: path.resolve(__dirname, '../../.env') })

module.exports = {
  JWT: process.env.JWT_SECRET,
  EXP: process.env.JWT_EXPIRATION
}
