const makeController = require('./controller')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const makeService = require('./service')
const { dbRepositories } = require('../../repositories')
const companyMapping = require('../../shared/mappings/companyMapping')
const makeServices = require('../../services')

module.exports = async () => {
  const { omieService } = makeServices()

  const service = makeService({
    omieService,
    companyMapping,
    companiesRepository: (await dbRepositories()).companies
  })

  const controller = makeController({
    schema,
    validateWithSchema,
    service
  })

  return controller
}
