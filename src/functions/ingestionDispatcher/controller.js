const handleSuccess = require('../../infra/lambda/handleSuccess')
const handleError = require('../../infra/lambda/handleError')

module.exports = ({
  service
}) => async () => {
  try {
    /* EventBridge scheduled event */

    const data = await service()

    return handleSuccess(data)
  } catch (error) {
    return handleError(error)
  }
}
