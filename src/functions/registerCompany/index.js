const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const OmieService = require('../../infra/services/omieService')
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

exports.handler = handler(controller)
