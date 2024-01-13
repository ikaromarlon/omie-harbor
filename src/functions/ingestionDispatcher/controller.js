const handleSuccess = require('../../infra/lambda/handleSuccess')
const handleError = require('../../infra/lambda/handleError')

module.exports = ({
  service,
  schema,
  validateWithSchema
}) => async (request) => {
  try {
    /* EventBridge scheduled event */
    let payload = {}

    /* API Gateway HTTP event */
    const { body } = request
    if (body) {
      payload = validateWithSchema(body, schema)
    }

    const data = await service(payload)

    return handleSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}
