const { successHandler, errorHandler } = require('../../utils')

module.exports = ({
  validateRequestSchema,
  schema,
  useCase
}) => async (request) => {
  try {
    const payload = validateRequestSchema(request.payload, schema)

    const { 'X-User-Id': userId } = request.headers

    const data = await useCase({ userId, payload })

    return successHandler(data, 200)
  } catch (error) {
    throw errorHandler(error)
  }
}
