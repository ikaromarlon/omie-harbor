const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./schema')
const { dbRepositories } = require('../../repositories')
const { omieMappings } = require('../../mappings')
const makeServices = require('../../services')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')

module.exports = async () => {
  const { omieService } = makeServices()

  const useCase = makeUseCase({
    omieService,
    companyMapping: omieMappings.company,
    companiesRepository: (await dbRepositories()).companies
  })

  const controller = makeController({
    useCase: useCase,
    schema,
    validateRequestSchema
  })

  return controller
}
