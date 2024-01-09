const HttpStatus = require('../../common/helpers/HttpStatus')

module.exports = (
  data,
  statusCode = HttpStatus.OK,
  headers = {}
) => ({ statusCode, data, headers })
