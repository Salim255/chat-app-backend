const validator = require('validator')
const userModel = require('../models/userModel')
const tokenHandler = require('../utils/authToken')
const passwordHandler = require('../utils/password')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const objectFilter = require('../utils/objectFilter')

const signup = async (res, req, isStaff = false) => {
  const { email, password, first_name: firstName, last_name: lastName, confirm_password: confirmPassword } = req.body

  if (!validator.isEmail(email) || (!password || password.trim().length === 0) || (password !== confirmPassword)) {
    return next(new AppError('Invalid user information', 400))
  }

  const hashedPassword = await passwordHandler.hashedPassword(password)

  const user = await userModel.insert({ email, hashedPassword, firstName, lastName, isStaff })
  const token = tokenHandler.createToken(user.id)

  const tokenDetails = tokenHandler.tokenExpiration(token);

  res.status(200).json({
    status: 'success',
    data: {
      token,
      id: tokenDetails.id,
      expireIn: tokenDetails.exp
    }
  })
}

exports.createUser = catchAsync(async (req, res, next) => {
  await signup(res, req)
})

exports.createAdmin = catchAsync(async (req, res, next) => {
  await signup(res, req, isStaff = true)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  if (!validator.isEmail(email) || (!password || password.trim().length === 0)) {
    return next(new AppError('Incorrect email or password', 401))
  }

  // Get the current user
  const user = await userModel.getUser({ email, password })

  // Check user exist
  if (!user) {
    return next(new AppError('User not found. Please check your information', 404))
  }

  // Check user password
  const passwordIsCorrect = await passwordHandler.correctPassword(password, user.password)

  if (!passwordIsCorrect) {
    return next(new AppError('Incorrect email or password', 401))
  }
  // Prepare token's detail
  const token = tokenHandler.createToken(user.id)
  const tokenDetails = tokenHandler.tokenExpiration(token)

  res.status(200).json({
    status: 'success',
    data: { token, id: tokenDetails.id, expireIn: tokenDetails.exp }
  })
})

exports.updateMe = catchAsync(async (req, res, next) => {
  // console.log(req.file)
  // 1) Create error if user POTS passwords data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError('This route is not for password updates. Please /updateMyPassword', 400)
    )
  }

  // 2) Filter out unwanted fields names that are not allowed to be updated
  const filteredBody = objectFilter.filterObj(req.body, 'first_name', 'last_name');
  if (req.file) {
    filteredBody.avatar = req.file.filename;
  }

  // 3 Fetch the current user from the database
  const savedUser = await userModel.getUserById(req.userId);
  if (!savedUser) {
    return next(
      new AppError('User not found', 400)
    )
  }

  // 5) Dynamically construct the update query clause
  const values = [];
  const fields = [];
  let query = 'UPDATE users SET ';
  Object.keys(filteredBody).forEach((key, index) => {
    // Exclude id key from being updated
    if (key !== 'id' && filteredBody[key] !== undefined) {
      fields.push(`${key} = $${index + 1}`);
      values.push(filteredBody[key])
    }
  })

  // If no fields to update, return early
  if (fields.length === 0) {
    return res.status(200).json({
      status: 'success',
      data: savedUser
    }) // No changes, return existing data
  }

  // Build and Add WHERE clause and append ID to the values
  query += `${fields.join(', ')} WHERE id = $${values.length + 1} RETURNING *;`;
  values.push(savedUser.id)

  // 3) Update user document
  const result = await userModel.updateUser(query, values);

  // Exclude password from the response
  // Here we structured the password of result then we assigned to a password
  // The we structured the rest and assigned to new variable responseData
  // the response to exclude the password field
  const { email, password, ...responseData } = result;

  res.status(200).json({
    status: 'success',
    data: responseData
  })
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1 Get token
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  }

  if (!token) {
    return next(new AppError('Invalid or missing token. Please provide a valid token', 401))
  }

  // 2 Verification token
  const decoded = await tokenHandler.decodedToken(token)

  // 3 Check if user still exist
  const user = await userModel.getUserById(decoded.id)
  if (!user) {
    return next(new AppError('User not found. Please check your information', 404))
  }

  // 4 Set user Id in req
  req.userId = decoded.id

  next()
})
