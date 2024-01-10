const axios = require('axios')
const { BadGatewayException } = require('../errors')

const handleResponse = (response) => response.data

const handleError = (error) => {
  throw new BadGatewayException(null, {
    statusCode: error.response.status,
    response: error.response.data,
    headers: error.response.headers
  })
}

module.exports = {
  get: async (url, headers = {}) => {
    try {
      const response = await axios.get(url, { headers })
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  },
  post: async (url, data = {}, headers = {}) => {
    try {
      const response = await axios.post(url, data, { headers })
      return handleResponse(response)
    } catch (error) {
      return handleError(error)
    }
  }
}
