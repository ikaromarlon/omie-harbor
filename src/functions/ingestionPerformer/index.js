const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const OmieService = require('../../infra/services/omieService')
const mappings = require('./mappings')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Repositories = require('../../repositories/genericRepository')
const SQS = require('../../infra/sqs')
const logger = require('../../common/helpers/logger')

const omieService = OmieService()
const companiesRepository = CompaniesRepository()
const repositories = Repositories()
const sqs = SQS()

const service = makeService({
  omieService,
  mappings,
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
