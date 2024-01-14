module.exports = ({
  statusCode,
  data,
  headers = {}
}) => ({
  statusCode,
  body: JSON.stringify(data),
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': '*',
    'Access-Control-Allow-Credentials': true,
    ...headers
  }
})
