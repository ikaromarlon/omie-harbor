const config = require('../config')
const mailer = require('./mailer')
const logger = require('./logger')

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
      logger.info({ title: 'PROCESS COMPLETED SUCCESSFULLY' })
      return response(statusCode, data)
    },
    error: async (statusCode = 500) => {
      const { message, stack, ...otherData } = data
      /** Error classes (data object) does not keep message and stack properties in JSON.stringify */
      const error = { message, stack, ...otherData }
      logger.error({ title: 'PROCESS ENDED WITH ERROR', message, data: error })
      if (config.services.mailer.errorNotificationRecipientAddress) {
        await mailer().sendErrorNotification(error)
      }
      if (config.app.stage === 'prd') {
        return response(statusCode, { message, ...otherData })
      }
      return response(statusCode, error)
    }
  }
}
