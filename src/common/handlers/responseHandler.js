const config = require('../../config')
const logger = require('../adapters/logger')
// const { isClientError } = require('../errors')

module.exports = (data, headers) => {
  const response = (statusCode, responseData) => ({
    statusCode,
    body: JSON.stringify(responseData),
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Credentials': true,
      ...(headers || {})
    }
  })

  return {
    success: (statusCode = 200) => {
      return response(statusCode, data)
    },
    error: async (statusCode = 500) => {
      const { message, stack, ...otherData } = data

      const simpleError = {
        statusCode,
        message,
        ...otherData
      }

      const fullError = {
        ...simpleError,
        stack
      }

      // if (isClientError(data)) {
      //   return response(statusCode, simpleError)
      // }

      logger.error({ title: 'PROCESS ENDED WITH ERROR', message, data: fullError })

      if (config.app.stage === 'prd') {
        return response(statusCode, simpleError)
      }

      return response(statusCode, fullError)
    }
  }
}
