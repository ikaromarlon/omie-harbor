const { successHandler, errorHandler } = require('../../common/handlers')
const { tryJsonParse } = require('../../common/helpers')

module.exports = ({
  schema,
  validateRequestSchema,
  useCase
}) => async (request) => {
  try {
    const parsedData = tryJsonParse(request.original.Records[0].body)

    const payload = validateRequestSchema(parsedData, schema)

    // const payload = validateRequestSchema(request.original.detail, schema)

    const data = await useCase({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
