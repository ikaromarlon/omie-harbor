const makeController = require('./controller')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeQueuer = require('../../common/adapters/queuer')

module.exports = async () => {
  const repositories = await dbRepositories()
  const queuer = makeQueuer()

  const useCase = makeUseCase({
    repositories,
    queuer,
    logger
  })

  const controller = makeController({
    useCase: useCase
  })

  return controller
}
