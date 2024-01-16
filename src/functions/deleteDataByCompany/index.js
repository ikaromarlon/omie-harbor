const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Repositories = require('../../repositories/genericRepository')
const SQS = require('../../infra/services/sqs')
const logger = require('../../common/helpers/logger')

const sqs = SQS()
const companiesRepository = CompaniesRepository()
const repositories = Repositories()

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

exports.handler = handler(controller)
