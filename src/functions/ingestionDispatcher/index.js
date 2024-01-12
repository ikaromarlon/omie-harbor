const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Queuer = require('../../common/adapters/queuer')
const logger = require('../../common/adapters/logger')

const companiesRepository = CompaniesRepository()
const queuer = Queuer()

const service = makeService({
  companiesRepository,
  queuer,
  logger
})

const controller = makeController({
  service
})

exports.handler = handleRequest(controller)
