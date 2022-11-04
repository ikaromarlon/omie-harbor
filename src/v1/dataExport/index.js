const makeController = require('./controller')
const schema = require('./schema')
const validateRequestSchema = require('../../common/utils/validateRequestSchema')
const makeUseCase = require('./useCase')
const { dbRepositories } = require('../../repositories')
const logger = require('../../common/adapters/logger')
const makeBucket = require('../../common/adapters/bucket')

module.exports = async () => {
  const repositories = await dbRepositories()
  const bucket = makeBucket()

  const useCase = makeUseCase({
    repositories,
    logger,
    bucket
  })

  const controller = makeController({
    schema,
    validateRequestSchema,
    useCase
  })

  return controller
}
