const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  service
}) => async () => {
  try {
    /* AWS EventBridge scheduled event */

    const data = await service()

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
