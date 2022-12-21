const { successHandler, errorHandler } = require('../../common/handlers')
const { tryJsonParse } = require('../../common/helpers')

module.exports = ({
  schema,
  validateRequestSchema,
  useCase
}) => async (request) => {
  try {
    /* AWS EventBridge event */
    let parsedData = request.original.detail

    /* AWS SQS event */
    if (request.original.Records) {
      parsedData = tryJsonParse(request.original.Records[0].body)
    }

    const payload = validateRequestSchema(parsedData, schema)

    const data = await useCase({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
