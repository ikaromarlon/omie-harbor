const factory = require('../../../../src/functions/dataExport')
const mongodb = require('../../../../src/repositories/utils/mongodb')

const makeSut = () => ({ sut: factory })

describe('dataExport Factory', () => {
  beforeAll(async () => mongodb.connect(process.env.MONGODB_URI, 'test'))

  afterAll(async () => mongodb.disconnect())

  it('Should setup function dependencies and return a controller method', async () => {
    const { sut } = makeSut()
    const result = await sut()
    expect(result).toBeInstanceOf(Function)
    expect(result.constructor.name).toBe('AsyncFunction')
  })
})
