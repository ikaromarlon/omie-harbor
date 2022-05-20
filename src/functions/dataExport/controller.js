const { successHandler, errorHandler, helpers: { tryJsonParse } } = require('../../utils')

module.exports = ({
  validatePayloadSchema,
  schema,
  useCase,
  logger
}) => async (request) => {
  try {
    const selectedPayload = request.payload.records ? tryJsonParse(request.payload.records[0]?.body) : request.payload

    const payload = validatePayloadSchema(selectedPayload, schema)

    logger.info({ title: 'Data Export', message: 'Process started', data: payload })

    const data = await useCase({ payload })

    logger.info({ title: 'Data Export', message: 'Process finished successfully', data: data })

    return successHandler(data, 200)
  } catch (error) {
    const errorHandled = errorHandler(error)
    logger.error({ title: 'Data Export', message: 'Process ended with errors', data: errorHandled })
    throw errorHandled
  }
}
