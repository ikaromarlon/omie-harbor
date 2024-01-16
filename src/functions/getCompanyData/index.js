const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const CompaniesRepository = require('../../repositories/companiesRepository')
const S3 = require('../../infra/services/s3')

const companiesRepository = CompaniesRepository()
const s3 = S3()

const service = makeService({
  companiesRepository,
  s3
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handler(controller)
