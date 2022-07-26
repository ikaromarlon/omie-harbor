const { successHandler, errorHandler } = require('../../utils')

module.exports = ({
  validatePayloadSchema,
  schema,
  useCase
}) => async (request) => {
  try {
    const payload = validatePayloadSchema(request.payload, schema)

    const data = await useCase({ payload })

    return successHandler(data, 200)
  } catch (error) {
    throw errorHandler(error)
  }
}
