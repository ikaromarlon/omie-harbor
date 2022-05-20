const { app: { stage } } = require('../config')

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
    error: (statusCode = 500) => {
      const { message, stack } = data
      const simpleError = { message }
      const fullError = { message, ...data, stack }
      console.error(`PROCESS ENDED\n${JSON.stringify(fullError, null, 2)}`)
      return response(statusCode, stage !== 'prd' ? fullError : simpleError)
    }
  }
}
