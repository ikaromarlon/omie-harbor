const { ApplicationError, InternalServerErrorException } = require('../errors')

module.exports = (error) => {
  if (error instanceof ApplicationError) return error
  return new InternalServerErrorException(error.message, error.stack)
}
