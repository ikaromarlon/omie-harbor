const handleSuccess = require('../../infra/lambda/handleSuccess')
const handleError = require('../../infra/lambda/handleError')
const HttpStatus = require('../../common/helpers/HttpStatus')

module.exports = ({
  service,
  schema,
  validateWithSchema
}) => async (request) => {
  try {
    /* SQS event */
    const { records } = request

    const payload = validateWithSchema(records[0].body, schema)

    const data = await service(payload)

    return handleSuccess(data, HttpStatus.NO_CONTENT)
  } catch (error) {
    return handleError(error)
  }
}
