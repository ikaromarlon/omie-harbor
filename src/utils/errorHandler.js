const { ApplicationError, InternalServerError } = require('./errors')

module.exports = (error) => {
  if (error instanceof ApplicationError) return error
  return new InternalServerError(error.message, error.stack)
}
