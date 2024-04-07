const userModel = require('../models/userModel')

exports.counter = async () => {
  const result = await userModel.counter()
  return result
}
