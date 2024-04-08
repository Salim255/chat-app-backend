const bcrypt = require('bcryptjs')

exports.hashedPassword = async (password) => {
  return bcrypt.hash(password, 12)
}

exports.correctPassword = async (candidatePassword, userPassword) => {
  return bcrypt.compare(candidatePassword, userPassword)
}
