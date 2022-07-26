const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./utils/schema')
const { dbRepositories } = require('../../repositories')
const { validatePayloadSchema } = require('../../utils')

module.exports = async () => {
  const repositories = await dbRepositories()

  const useCase = makeUseCase({
    repositories
  })

  const controller = makeController({
    validatePayloadSchema,
    schema,
    useCase: useCase
  })

  return controller
}
