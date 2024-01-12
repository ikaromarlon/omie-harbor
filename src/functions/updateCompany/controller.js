const handleSuccess = require('../../infra/lambda/handleSuccess')
const handleError = require('../../infra/lambda/handleError')

module.exports = ({
  service,
  schema,
  validateWithSchema
}) => async (request) => {
  try {
    /* API Gateway HTTP event */
    const { params, body } = request

    const payload = validateWithSchema({ ...params, ...body }, schema)

    const data = await service(payload)

    return handleSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}
