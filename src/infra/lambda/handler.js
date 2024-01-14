const handleRequest = require('./handleRequest')
const handleResponse = require('./handleResponse')

module.exports = (controller) => async (event) => {
  if (event.warmup) return console.log('Warming function...')
  const request = handleRequest(event)
  const result = await controller(request)
  const response = handleResponse(result)
  return response
}
