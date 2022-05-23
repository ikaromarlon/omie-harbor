const axios = require('axios')
const { millisecondsToSeconds } = require('./helpers')

module.exports = () => {
  const makeResponse = ({ startDate, endDate, response }) => ({
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    responseTime: `${millisecondsToSeconds(endDate - startDate)}s`,
    statusCode: response.status,
    headers: response.headers,
    data: response.data
  })

  const errorHandler = ({ startDate, endDate, error }) => {
    const [name, version] = error.config.headers['User-Agent'].split('/')
    const err = new Error(error.message)
    err.startDate = new Date(startDate)
    err.endDate = new Date(startDate)
    err.responseTime = `${millisecondsToSeconds(endDate - startDate)}s`
    err.agent = {
      name,
      version,
      errorCode: error.code,
      errorNumber: error.errno
    }
    err.request = {
      method: error.config.method,
      url: error.config.url,
      data: error.config.data,
      headers: error.config.headers
    }
    err.response = {
      statusCode: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers
    }
    return err
  }

  return {
    get: async (url, headers = {}) => {
      const startDate = Date.now()
      try {
        const response = await axios.get(url, { headers })
        return makeResponse({ startDate, endDate: Date.now(), response })
      } catch (error) {
        throw errorHandler({ startDate, endDate: Date.now(), error })
      }
    },
    post: async (url, data = {}, headers = {}) => {
      const startDate = Date.now()
      try {
        const response = await axios.post(url, data, { headers })
        return makeResponse({ startDate, endDate: Date.now(), response })
      } catch (error) {
        throw errorHandler({ startDate, endDate: Date.now(), error })
      }
    }
  }
}
