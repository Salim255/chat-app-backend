const validator = require('validator')
const userModel = require('../models/userModel')
const tokenHandler = require('../utils/authToken')
const passwordHandler = require('../utils/password')

exports.signup = async (req, res) => {
  const { email, password, first_name: firstName, last_name: lastName } = req.body

  if (!validator.isEmail(email) || (!password || password.trim().length === 0)) {
    return res.status(401).json({
      status: 'error'
    })
  }

  const hashedPassword = await passwordHandler.hashedPassword(password)

  const user = await userModel.insert({ email, hashedPassword, firstName, lastName })

  const token = tokenHandler.createToken(user.id)

  const tokenDetails = tokenHandler.tokenExpiration(token)

  res.status(200).json({
    status: 'success',
    data: {
      token,
      id: tokenDetails.id,
      expiresIn: tokenDetails.exp
    }
  })
}

exports.login = async (req, res, next) => {
  const { email, password } = req.body

  if (!validator.isEmail(email) || (!password || password.trim().length === 0)) {
    return res.status(401).json({
      status: 'error'
    })
  }

  // Get the current user
  const user = await userModel.getUser({ email, password })

  // Check user exist
  if (!user) {
    return res.status(401)
      .json({
        status: 'error',
        data: 'error'
      })
  }

  // Check user password
  const passwordIsCorrect = await passwordHandler.correctPassword(password, user.password)

  if (!passwordIsCorrect) {
    return res.status(401)
      .json({
        status: 'failed',
        message: 'Incorrect email or password'
      })
  }
  // Prepare token's detail
  const token = tokenHandler.createToken(user.id)
  const tokenDetails = tokenHandler.tokenExpiration(token)

  res.status(200).json({
    status: 'success',
    data: { token, id: tokenDetails.id, expireIn: tokenDetails.exp }
  })
}

exports.protect = async (req, res, next) => {
  // 1 Get token
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return res.status(401)
      .json({
        status: 'failed',
        message: 'token'
      })
  }

  // 2 Verification token
  const decoded = await tokenHandler.decodedToken(token)

  // 3 Check if user still exist
  const user = await userModel.getUserById(decoded.id)
  if (!user) {
    return res.status(401)
      .json({
        status: 'failed',
        message: 'error'
      })
  }

  // 4 Set user Id in req
  req.userId = decoded.id

  next()
}
