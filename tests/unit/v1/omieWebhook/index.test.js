const factory = require('../../../../src/v1/omieWebhook')
const mongodb = require('../../../../src/repositories/utils/mongodb')

const makeSut = () => ({ sut: factory })

describe('omieWebhook Factory', () => {
  beforeAll(async () => mongodb.connect(process.env.MONGODB_URI, 'test'))

  afterAll(async () => mongodb.disconnect())

  it('Should setup function dependencies and return a controller method', async () => {
    const { sut } = makeSut()
    const result = await sut()
    expect(result).toBeInstanceOf(Function)
    expect(result.constructor.name).toBe('AsyncFunction')
  })
})
