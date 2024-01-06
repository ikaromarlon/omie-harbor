const makeController = require('./controller')
const makeService = require('./service')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeQueuer = require('../../common/adapters/queuer')

module.exports = async () => {
  const repositories = await dbRepositories()
  const queuer = makeQueuer()

  const service = makeService({
    repositories,
    queuer,
    logger
  })

  const controller = makeController({
    service
  })

  return controller
}
