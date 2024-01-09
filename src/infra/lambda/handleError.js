const HttpStatus = require('../../common/helpers/HttpStatus')
const logger = require('../../common/adapters/logger')

module.exports = (
  error,
  statusCode = HttpStatus.INTERNAL_SERVER_ERROR,
  headers = {}
) => {
  const { message, stack, ...others } = error

  const data = {
    statusCode,
    message,
    ...others
  }

  const log = {
    ...data,
    stack
  }

  logger.error(message, log)

  return { statusCode, data, headers }
}
