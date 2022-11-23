const bodyParser = require('../utils/bodyParser')

module.exports = (request) => {
  const {
    headers = {},
    params = {},
    pathParameters = {},
    query = {},
    queryStringParameters = {}
  } = request

  const body = bodyParser(request)

  const parsed = {
    headers,
    body,
    params: {
      ...params,
      ...pathParameters
    },
    query: {
      ...query,
      ...queryStringParameters
    }
  }

  const payload = {
    ...pathParameters,
    ...params,
    ...query,
    ...queryStringParameters,
    ...body
  }

  return {
    original: request,
    ...parsed,
    payload
  }
}
