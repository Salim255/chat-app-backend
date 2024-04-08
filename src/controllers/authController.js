const validator = require('validator')
const userModel = require('../models/userModel')
const tokenHandler = require('../utils/authToken')
const passwordHandler = require('../utils/password')

exports.signup = async (req, res) => {
  const { email, password, first_name: firsName, last_name: lastName } = req.body

  if (!validator.isEmail(email) || (!password || password.trim().length === 0)) {
    return res.status(401).json({
      status: 'error'
    })
  }

  const hashedPassword = await passwordHandler.hashedPassword(password)

  const user = await userModel.insert({ email, hashedPassword, firsName, lastName })

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
  const token = await tokenHandler.createToken(user.id)
  const tokenDetails = await tokenHandler.tokenExpiration(token)

  res.status(200).json({
    status: 'success',
    data: { token, id: tokenDetails.id, expireIn: tokenDetails.exp }
  })
}
