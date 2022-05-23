const { successHandler, errorHandler } = require('../../utils')
const { tryJsonParse } = require('../../utils/helpers')

module.exports = ({
  validatePayloadSchema,
  schema,
  useCase,
  logger
}) => async (request) => {
  try {
    const selectedPayload = request.payload.records ? tryJsonParse(request.payload.records[0]?.body) : request.payload

    const payload = validatePayloadSchema(selectedPayload, schema)

    logger.info({ title: 'Ingestion: Performer', message: 'Process started', data: payload })

    const data = await useCase({ payload })

    logger.info({ title: 'Ingestion: Performer', message: 'Process finished successfully', data: data })

    return successHandler(data, 200)
  } catch (error) {
    const errorHandled = errorHandler(error)
    logger.error({ title: 'Ingestion: Performer', message: 'Process ended with errors', data: errorHandled })
    throw errorHandled
  }
}
