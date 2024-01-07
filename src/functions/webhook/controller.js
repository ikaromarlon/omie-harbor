const { errorHandler, successHandler } = require('../../common/handlers')
const { tryJsonParse } = require('../../common/utils')

module.exports = ({
  schema,
  validateWithSchema,
  service
}) => async (request) => {
  try {
    /* AWS SQS event */
    const parsedData = tryJsonParse(request.original.Records[0].body)

    const payload = validateWithSchema(parsedData, schema)

    const data = await service({ payload })

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
