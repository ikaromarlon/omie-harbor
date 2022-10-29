const bodyParser = require('../utils/bodyParser')

module.exports = (event) => {
  const {
    headers = {},
    params = {},
    pathParameters = {},
    query = {},
    queryStringParameters = {},
    eventParameters = {},
    Records: records = []
  } = event

  const body = bodyParser(event)

  const parsedRequest = {
    headers,
    body,
    params: {
      ...params,
      ...pathParameters
    },
    query: {
      ...query,
      ...queryStringParameters
    },
    event: {
      ...eventParameters,
      ...(records.length ? { records } : {})
    }
  }

  const payload = {
    ...pathParameters,
    ...params,
    ...query,
    ...queryStringParameters,
    ...eventParameters,
    ...body,
    ...(records.length ? { records } : {})
  }

  return { ...parsedRequest, payload }
}
