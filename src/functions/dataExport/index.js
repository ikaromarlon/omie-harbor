const handleRequest = require('../../infra/lambda/handleRequest')
const makeController = require('./controller')
const makeService = require('./service')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const Repositories = require('../../repositories')
const Bucket = require('../../common/adapters/bucket')
const logger = require('../../common/adapters/logger')

const bucket = Bucket()

const service = makeService({
  Repositories,
  bucket,
  logger
})

const controller = makeController({
  service,
  schema,
  validateWithSchema
})

exports.handler = handleRequest(controller)
