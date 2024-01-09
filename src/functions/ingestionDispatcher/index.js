const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
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
  service
})

exports.handler = handleRequest(controller)
