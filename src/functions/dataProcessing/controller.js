const { successHandler, errorHandler } = require('../../utils')
const { tryJsonParse } = require('../../utils/helpers')

module.exports = ({
  validatePayloadSchema,
  schema,
  useCase
}) => async (request) => {
  try {
    const parsedPayload = tryJsonParse(request.payload.records[0].body)

    const payload = validatePayloadSchema(parsedPayload, schema)

    const data = await useCase(payload)

    return successHandler(data, 200)
  } catch (error) {
    throw errorHandler(error)
  }
}
