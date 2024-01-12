const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Repositories = require('../../repositories/genericRepository')
const SQS = require('../../infra/sqs')
const logger = require('../../common/helpers/logger')

const companiesRepository = CompaniesRepository()
const repositories = Repositories()
const sqs = SQS()

const service = makeService({
  companiesRepository,
  repositories,
  sqs,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
