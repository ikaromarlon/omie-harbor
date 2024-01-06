const { errorHandler, successHandler } = require('../../common/handlers')
const { tryJsonParse } = require('../../common/helpers')

module.exports = ({
  schema,
  validateRequestSchema,
  service
}) => async (request) => {
  try {
    /* AWS SQS event */
    const parsedData = tryJsonParse(request.original.Records[0].body)

    const payload = validateRequestSchema(parsedData, schema)

    const data = await service({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
