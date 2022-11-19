const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  schema,
  validateRequestSchema,
  useCase
}) => async (request) => {
  try {
    const payload = validateRequestSchema(request.payload, schema)

    const data = await useCase({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}