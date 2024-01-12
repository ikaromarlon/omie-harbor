const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const Repositories = require('../../repositories/genericRepository')
const CompaniesRepository = require('../../repositories/companiesRepository')
const Bucket = require('../../common/adapters/bucket')
const logger = require('../../common/adapters/logger')

const bucket = Bucket()
const companiesRepository = CompaniesRepository()
const repositories = Repositories()

const service = makeService({
  companiesRepository,
  repositories,
  bucket,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
