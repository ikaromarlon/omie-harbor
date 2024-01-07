const makeController = require('./controller')
const schema = require('./schema')
const validateWithSchema = require('../../common/helpers/validateWithSchema')
const makeService = require('./service')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeQueuer = require('../../common/adapters/queuer')

module.exports = async () => {
  const repositories = await dbRepositories()
  const queuer = makeQueuer()

  const service = makeService({
    repositories,
    logger,
    queuer
  })

  const controller = makeController({
    schema,
    validateWithSchema,
    service
  })

  return controller
}
