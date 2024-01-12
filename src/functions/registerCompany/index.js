const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const OmieService = require('../../shared/services/omieService')
const companyMapping = require('../../shared/mappings/companyMapping')
const CompaniesRepository = require('../../repositories/companiesRepository')

const omieService = OmieService()
const companiesRepository = CompaniesRepository()

const service = makeService({
  omieService,
  companyMapping,
  companiesRepository
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
