const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Repositories = require('../../repositories/genericRepository')
const Queuer = require('../../common/adapters/queuer')
const logger = require('../../common/adapters/logger')

const queuer = Queuer()
const companiesRepository = CompaniesRepository()
const repositories = Repositories()

const service = makeService({
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
