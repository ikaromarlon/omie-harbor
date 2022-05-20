const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./utils/schema')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const { queuer: makeQueuer, logger: makeLogger, validatePayloadSchema } = require('../../adapters')

module.exports = async () => {
  const { omieService } = makeServices()
  const repositories = await dbRepositories()
  const logger = makeLogger()
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
    validatePayloadSchema,
    useCase: useCase,
    logger
  })

  return controller
}
