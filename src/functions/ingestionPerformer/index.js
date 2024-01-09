const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const OmieService = require('../../shared/services/omieService')
const mappings = require('./mappings')
const Repositories = require('../../repositories')
const Queuer = require('../../common/adapters/queuer')
const logger = require('../../common/adapters/logger')

const omieService = OmieService()
const queuer = Queuer()

const service = makeService({
  omieService,
  mappings,
  Repositories,
  queuer,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
