const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')

module.exports = async () => {
  const repositories = await dbRepositories()

  const useCase = makeUseCase({
    repositories,
    logger
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
