const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const logger = require('../../common/adapters/logger')
const makeEventBridge = require('../../common/adapters/eventBridge')

module.exports = async () => {
  const { omieService } = makeServices()
  const repositories = await dbRepositories()
  const eventBridge = makeEventBridge('ingestionPerformer')

  const useCase = makeUseCase({
    omieService,
    omieMappings,
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
