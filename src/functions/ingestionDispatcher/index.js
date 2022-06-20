const makeController = require('./controller')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const { queuer: makeQueuer, logger } = require('../../utils')

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
