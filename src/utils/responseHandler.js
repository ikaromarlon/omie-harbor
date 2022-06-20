const config = require('../config')
const mailer = require('./mailer')
const logger = require('./logger')

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
      logger.info({ title: 'PROCESS COMPLETED SUCCESSFULLY' })
      return response(statusCode, data)
    },
    error: async (statusCode = 500) => {
      const { message, stack } = data
      const error = { message, ...data, stack }
      logger.error({ title: 'PROCESS ENDED WITH ERROR', message, data: error })
      if (config.services.mailer.errorNotificationRecipientAddres) {
        await mailer().sendErrorNotification(error)
      }
      if (config.app.stage === 'prd') {
        return response(statusCode, { message })
      }
      return response(statusCode, error)
    }
  }
}
