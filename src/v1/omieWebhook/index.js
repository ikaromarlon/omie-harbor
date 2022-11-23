const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeEventBridge = require('../../common/adapters/eventBridge')

module.exports = async () => {
  const repositories = await dbRepositories()
  const eventBridge = makeEventBridge('ingestionPerformer')

  const useCase = makeUseCase({
    repositories,
    logger,
    eventBridge
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
