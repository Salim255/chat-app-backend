const jwt = require('jsonwebtoken')
const tokenConfig = require('../config/token')
const { promisify } = require('util')
exports.createToken = (userId) => {
  return jwt.sign({ id: userId }, tokenConfig.JWT, { expiresIn: tokenConfig.EXP })
}

exports.tokenExpiration = (token) => {
  return jwt.verify(token, tokenConfig.JWT)
}

exports.decodedToken = async (token) => {
  return promisify(jwt.verify)(token, tokenConfig.JWT)
}
