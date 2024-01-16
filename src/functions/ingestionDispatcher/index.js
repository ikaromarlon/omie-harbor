const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const CompaniesRepository = require('../../repositories/companiesRepository')
const SQS = require('../../infra/services/sqs')
const logger = require('../../common/helpers/logger')

const companiesRepository = CompaniesRepository()
const sqs = SQS()

const service = makeService({
  companiesRepository,
  sqs,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handler(controller)
