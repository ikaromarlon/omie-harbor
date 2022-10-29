const { successHandler, errorHandler } = require('../../common/handlers')
const { tryJsonParse } = require('../../common/helpers')

module.exports = ({
  validateRequestSchema,
  schema,
  useCase
}) => async (request) => {
  try {
    const parsedPayload = tryJsonParse(request.payload.records[0].body)

    const payload = validateRequestSchema(parsedPayload, schema)

    const data = await useCase(payload)

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
