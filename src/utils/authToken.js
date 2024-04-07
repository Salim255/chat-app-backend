const jwt = require('jsonwebtoken')
const tokenConfig = require('../config/token')

exports.createToken = (userId) => {
  return jwt.sign({ id: userId }, tokenConfig.JWT, { expiresIn: tokenConfig.EXP })
}

exports.tokenExpiration = (token) => {
  return jwt.verify(token, tokenConfig.JWT)
}
