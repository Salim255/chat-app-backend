require('dotenv').config();
module.exports = {
  JWT: process.env.JWT_SECRET,
  EXP: process.env.JWT_EXPIRATION
}
