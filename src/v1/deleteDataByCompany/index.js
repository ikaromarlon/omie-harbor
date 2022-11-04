const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')

module.exports = async () => {
  const repositories = await dbRepositories()

  const useCase = makeUseCase({
    repositories
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
