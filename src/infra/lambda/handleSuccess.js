const HttpStatus = require('../../common/helpers/HttpStatus')

module.exports = (
  data,
  statusCode,
  headers
) => {
  const result = {
    statusCode: statusCode || HttpStatus.OK,
    data,
    headers: headers || {}
  }
  return result
}
