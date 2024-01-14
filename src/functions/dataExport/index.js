const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const Repositories = require('../../repositories/genericRepository')
const CompaniesRepository = require('../../repositories/companiesRepository')
const S3 = require('../../infra/s3')
const logger = require('../../common/helpers/logger')

const companiesRepository = CompaniesRepository()
const repositories = Repositories()
const s3 = S3()

const service = makeService({
  companiesRepository,
  repositories,
  s3,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handler(controller)
