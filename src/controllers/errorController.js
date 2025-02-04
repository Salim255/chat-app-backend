const AppError = require('../utils/appError')
const pool = require('../config/pool')
const sendErrorDev = async (err, res) => {
  await pool.query('ROLLBACK');
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  })
}

const sendErrorProd = async (err, res) => {
  await pool.query('ROLLBACK');
  // Operational error, error that we trust: send message to the client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    })
  } else {
    // Programming or other unknown errors: we don't need to leak the details to the client

    // 1) Log error
    console.error('ERROR 💥', err);

    // 2) Send the generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!'
    })
  }
}

const handleDuplicateError = (detail) => {
  const result = detail.split(/[(=)]/)[4]
  return new AppError(`Duplicate field value: ${result}. Please use another email`, 400)
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err }
    if (err.code === '23505') {
      error = handleDuplicateError(err.detail)
    }
    sendErrorProd(error, res)
  }
}
