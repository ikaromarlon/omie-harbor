const { tryJsonParse } = require('../utils/helpers')

module.exports = (event) => {
  const {
    httpMethod = null,
    headers = {},
    pathParameters = {},
    queryStringParameters = {},
    body = {},
    eventParameters = {},
    Records = []
  } = event

  const payload = {
    ...pathParameters,
    ...queryStringParameters,
    ...tryJsonParse(body),
    ...eventParameters
  }

  if (Records.length) payload.records = Records

  return {
    httpMethod,
    headers,
    payload
  }
}
