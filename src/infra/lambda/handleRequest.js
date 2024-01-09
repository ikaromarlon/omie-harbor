const formatRequest = require('./formatRequest')
const formatResponse = require('./formatResponse')

module.exports = (controller) => async (event) => {
  if (event.warmup) return console.log('Warming function...')
  const request = formatRequest(event)
  const result = await controller(request)
  const response = formatResponse(result)
  return response
}
