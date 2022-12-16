const { successHandler, errorHandler } = require('../../common/handlers')

module.exports = ({
  useCase
}) => async () => {
  try {
    const data = await useCase()

    return successHandler({ data })
  } catch (error) {
    throw errorHandler(error)
  }
}
