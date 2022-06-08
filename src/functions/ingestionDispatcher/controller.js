const { successHandler, errorHandler } = require('../../utils')

module.exports = ({
  useCase
}) => async () => {
  try {
    const data = await useCase()

    return successHandler(data, 200)
  } catch (error) {
    throw errorHandler(error)
  }
}
