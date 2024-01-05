const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const makeEventBridge = require('../../common/adapters/eventBridge')

module.exports = async () => {
  const repositories = await dbRepositories()
  const eventBridge = makeEventBridge('deleteDataByCompany')

  const useCase = makeUseCase({
    repositories,
    eventBridge
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
