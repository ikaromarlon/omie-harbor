const makeController = require('./controller')
const makeUseCase = require('./useCase')
const schema = require('./utils/schema')
const { dbRepositories } = require('../../repositories')
const { logger: makeLogger, bucket: makeBucket, validatePayloadSchema } = require('../../utils')

module.exports = async () => {
  const repositories = await dbRepositories()
  const bucket = makeBucket()
  const logger = makeLogger()

  const useCase = makeUseCase({
    repositories,
    logger,
    bucket
  })

  const controller = makeController({
    validatePayloadSchema,
    schema,
    useCase: useCase,
    logger
  })

  return controller
}
