const handleSuccess = require('../../infra/lambda/handleSuccess')
const handleError = require('../../infra/lambda/handleError')
const HttpStatus = require('../../common/helpers/HttpStatus')

module.exports = ({
  service,
  schema,
  validateWithSchema
}) => async (request) => {
  try {
    /* API Gateway HTTP event */
    const { params } = request

    const payload = validateWithSchema(params, schema)

    const url = await service(payload)

    return handleSuccess(null, HttpStatus.SEE_OTHER, { Location: url })
  } catch (error) {
    return handleError(error)
  }
}
