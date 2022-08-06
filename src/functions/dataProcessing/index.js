const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./utils/schema')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const { logger, mailer, validatePayloadSchema } = require('../../utils')

module.exports = async () => {
  const { omieService } = makeServices()
  const repositories = await dbRepositories()

  const useCase = makeUseCase({
    omieService,
    repositories,
    omieMappings,
    logger,
    mailer: mailer()
  })

  const controller = makeController({
    validatePayloadSchema,
    schema,
    useCase: useCase
  })

  return controller
}
