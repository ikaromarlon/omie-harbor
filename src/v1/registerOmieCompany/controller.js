const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  schema,
  validateRequestSchema,
  useCase
}) => async (request) => {
  try {
    const payload = validateRequestSchema(request.payload, schema)

    const { 'X-User-Id': userId } = request.headers

    const data = await useCase({ userId, payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
