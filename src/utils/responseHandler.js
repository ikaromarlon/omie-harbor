const { app: { stage } } = require('../config')
const { expectedErrors } = require('./errors')
const mailer = require('./mailer')

module.exports = (data, headers) => {
  const response = (statusCode, responseData) => {
    return {
      statusCode,
      body: JSON.stringify(responseData),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        'Access-Control-Allow-Credentials': true,
        ...(headers || {})
      }
    }
  }

  return {
    success: (statusCode = 200) => {
      return response(statusCode, data)
    },
    error: async (statusCode = 500) => {
      const { message, stack } = data
      const error = { message, ...data, stack }
      const parsedError = JSON.stringify(error, null, 2)
      if (!expectedErrors.includes(error.name)) {
        console.error(`PROCESS ENDED WITH ERRORS\n${parsedError}`)
        await mailer().sendErrorNotification(error)
      } else {
        console.error(`PROCESS ENDED SUCCESSFULLY BUT WITH ERROR\n${parsedError}`)
      }
      if (stage === 'prd') {
        return response(statusCode, { message })
      }
      return response(statusCode, error)
    }
  }
}
