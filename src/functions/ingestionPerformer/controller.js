const handleSuccess = require('../../infra/lambda/handleSuccess')
const handleError = require('../../infra/lambda/handleError')

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

    return handleSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}
