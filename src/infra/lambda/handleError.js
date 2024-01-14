const HttpStatus = require('../../common/helpers/HttpStatus')
const logger = require('../../common/helpers/logger')
const { isServerSideError } = require('../../common/errors')

module.exports = (
  error,
  statusCode,
  headers
) => {
  const result = {
    statusCode: statusCode || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    data: { message: error.message },
    headers: headers || {}
  }

  if (isServerSideError(result)) {
    logger.error('PROCESS ENDED WITH ERROR', {
      error: {
        message: error.message,
        stack: error.stack,
        ...error,
        response: result
      }
    })
  }

  return result
}
