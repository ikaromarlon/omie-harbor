const { ExternalServerError, ValidationError } = require('../../common/errors')
const { errorHandler, successHandler } = require('../../common/handlers')

module.exports = ({
  schema,
  validateRequestSchema,
  useCase
}) => async (request) => {
  try {
    const payload = validateRequestSchema(request.payload, schema, ExternalServerError)

    const data = await useCase({ payload })

    return successHandler({ data })
  } catch (error) {
    if (error instanceof ValidationError) {
      throw new ExternalServerError(error.message, request.payload)
    }
    throw errorHandler(error)
  }
}
