const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  schema,
  validateRequestSchema,
  service
}) => async (request) => {
  try {
    /* AWS API Gateway HTTP event */
    const payload = validateRequestSchema(request.payload, schema)

    const data = await service({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
