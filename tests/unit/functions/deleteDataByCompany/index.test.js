const factory = require('../../../../src/functions/deleteDataByCompany')
const mongodb = require('../../../../src/repositories/helpers/mongodb')

const makeSut = () => ({ sut: factory })

describe('deleteDataByCompany Factory', () => {
  beforeAll(async () => mongodb.connect(process.env.MONGODB_URI, 'test'))

  afterAll(async () => mongodb.disconnect())

  it('Should setup function dependencies and return a controller method', async () => {
    const { sut } = makeSut()
    const result = await sut()
    expect(result).toBeInstanceOf(Function)
    expect(result.constructor.name).toBe('AsyncFunction')
  })
})
