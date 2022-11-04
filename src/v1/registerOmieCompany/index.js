const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')

module.exports = async () => {
  const { omieService } = makeServices()

  const useCase = makeUseCase({
    omieService,
    companyMapping: omieMappings.company,
    companiesRepository: (await dbRepositories()).companies
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
