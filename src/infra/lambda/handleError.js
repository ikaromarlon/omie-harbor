const HttpStatus = require('../../common/helpers/HttpStatus')
const logger = require('../../common/adapters/logger')
const { isServerSideError } = require('../../common/errors')

module.exports = (error, statusCode, headers = {}) => {
  const response = {
    statusCode: statusCode || error.statusCode || HttpStatus.INTERNAL_SERVER_ERROR,
    data: {
      message: error.message
    },
    headers
  }

  if (isServerSideError(response)) {
    logger.error('PROCESS ENDED WITH ERROR', {
      response,
      error: {
        message: error.message,
        stack: error.stack,
        ...error
      }
    })
  }

  return response
}
