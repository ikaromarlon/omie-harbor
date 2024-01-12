const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const CompaniesRepository = require('../../repositories/companiesRepository')
const SQS = require('../../infra/sqs')
const logger = require('../../common/helpers/logger')

const companiesRepository = CompaniesRepository()
const sqs = SQS()

const service = makeService({
  companiesRepository,
  sqs,
  logger
})

const controller = makeController({
  service
})

exports.handler = handleRequest(controller)
