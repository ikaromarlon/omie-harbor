const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const logger = require('../../common/adapters/logger')
const mailer = require('../../common/adapters/mailer')

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
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
