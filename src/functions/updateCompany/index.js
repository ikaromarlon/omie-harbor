const handler = require('../../infra/lambda/handler')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const CompaniesRepository = require('../../repositories/companiesRepository')

const companiesRepository = CompaniesRepository()

const service = makeService({
  companiesRepository
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handler(controller)
