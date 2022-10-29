const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./schema')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const logger = require('../../common/adapters/logger')
const makeQueuer = require('../../common/adapters/queuer')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')

module.exports = async () => {
  const { omieService } = makeServices()
  const repositories = await dbRepositories()
  const queuer = makeQueuer()

  const useCase = makeUseCase({
    omieService,
    omieMappings,
    repositories,
    queuer,
    logger
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase: useCase
  })

  return controller
}
