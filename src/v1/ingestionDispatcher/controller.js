const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  useCase
}) => async () => {
  try {
    /* AWS EventBridge Cron event */

    const data = await useCase()

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
