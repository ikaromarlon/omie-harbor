const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./schema')
const { dbRepositories } = require('../../repositories')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')

module.exports = async () => {
  const repositories = await dbRepositories()

  const useCase = makeUseCase({
    repositories
  })

  const controller = makeController({
    validateRequestSchema,
    schema,
    useCase: useCase
  })

  return controller
}
