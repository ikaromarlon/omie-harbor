process.env.UUID = require('crypto').randomUUID() /** It must run before everything */
const { requestHandler, responseHandler } = require('./utils')

exports.handler = async (event, context) => {
  if (event.warmUp) return console.warn(`Warming up function ${context.functionName}...`)
  try {
    const fnName = context.functionName.split('-').pop()
    const fn = require(`./functions/${fnName}`)
    const controller = await fn()
    const request = requestHandler(event)
    const { data, statusCode, headers } = await controller(request)
    return responseHandler(data, headers).success(statusCode)
  } catch (error) {
    return responseHandler(error).error(error.statusCode)
  }
}
