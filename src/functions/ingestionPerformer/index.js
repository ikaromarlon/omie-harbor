const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const OmieService = require('../../shared/services/omieService')
const mappings = require('./mappings')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Repositories = require('../../repositories/genericRepository')
const Queuer = require('../../common/adapters/queuer')
const logger = require('../../common/adapters/logger')

const omieService = OmieService()
const companiesRepository = CompaniesRepository()
const repositories = Repositories()
const queuer = Queuer()

const service = makeService({
  omieService,
  mappings,
  companiesRepository,
  repositories,
  queuer,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
