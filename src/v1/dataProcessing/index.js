const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./schema')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const logger = require('../../common/adapters/logger')
const mailer = require('../../common/adapters/mailer')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')

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
    validateRequestSchema,
    schema,
    useCase: useCase
  })

  return controller
}
