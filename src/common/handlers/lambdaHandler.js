const errorHandler = require('./errorHandler')
const requestHandler = require('./requestHandler')
const responseHandler = require('./responseHandler')

module.exports = (controller) => {
  return async (event, context) => {
    if (event.warmUp) return console.warn(`Warming up function ${context.functionName}...`)
    try {
      const request = requestHandler(event)
      const { statusCode, headers, data } = await controller(request)
      return responseHandler(data, headers).success(statusCode)
    } catch (error) {
      const errorHandled = errorHandler(error)
      return responseHandler(errorHandled).error(errorHandled.statusCode)
    }
  }
}
