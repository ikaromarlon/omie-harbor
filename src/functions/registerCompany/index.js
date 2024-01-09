const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const OmieService = require('../../shared/services/omieService')
const companyMapping = require('../../shared/mappings/companyMapping')
const Repositories = require('../../repositories')

const omieService = OmieService()

const service = makeService({
  omieService,
  companyMapping,
  Repositories
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
