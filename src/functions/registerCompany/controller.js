const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  schema,
  validateWithSchema,
  service
}) => async (request) => {
  try {
    /* AWS API Gateway HTTP event */
    const payload = validateWithSchema(request.payload, schema)

    const data = await service({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
