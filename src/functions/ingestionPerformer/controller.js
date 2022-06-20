const { successHandler, errorHandler } = require('../../utils')
const { tryJsonParse } = require('../../utils/helpers')

module.exports = ({
  validatePayloadSchema,
  schema,
  useCase
}) => async (request) => {
  try {
    const selectedPayload = request.payload.records ? tryJsonParse(request.payload.records[0]?.body) : request.payload

    const payload = validatePayloadSchema(selectedPayload, schema)

    const data = await useCase({ payload })

    return successHandler(data, 200)
  } catch (error) {
    throw errorHandler(error)
  }
}
