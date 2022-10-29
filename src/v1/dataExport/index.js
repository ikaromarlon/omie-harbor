const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./schema')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeBucket = require('../../common/adapters/bucket')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')

module.exports = async () => {
  const repositories = await dbRepositories()
  const bucket = makeBucket()

  const useCase = makeUseCase({
    repositories,
    logger,
    bucket
  })

  const controller = makeController({
    validateRequestSchema,
    schema,
    useCase: useCase
  })

  return controller
}
