const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const Repositories = require('../../repositories')
const Queuer = require('../../common/adapters/queuer')
const logger = require('../../common/adapters/logger')

const queuer = Queuer()

const service = makeService({
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
