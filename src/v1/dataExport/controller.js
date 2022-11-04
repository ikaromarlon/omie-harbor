const { successHandler, errorHandler } = require('../../common/handlers')
const { tryJsonParse } = require('../../common/helpers')

module.exports = ({
  schema,
  validateRequestSchema,
  useCase
}) => async (request) => {
  try {
    const selectedPayload = request.payload.records ? tryJsonParse(request.payload.records[0]?.body) : request.payload

    const payload = validateRequestSchema(selectedPayload, schema)

    const data = await useCase({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
