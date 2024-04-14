module.exports = catchAsync = (fn) => {
  return (req, res, next) => fn(req, res, next).catch(err => next(err))
}
// This catchAsync function will receive a function with params (req, res, next) then  return anonyms function that return the result of received function
