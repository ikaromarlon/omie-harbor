const makeController = require('./controller')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const makeService = require('./service')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeBucket = require('../../common/adapters/bucket')

module.exports = async () => {
  const repositories = await dbRepositories()
  const bucket = makeBucket()

  const service = makeService({
    repositories,
    logger,
    bucket
  })

  const controller = makeController({
    schema,
    validateWithSchema,
    service
  })

  return controller
}
