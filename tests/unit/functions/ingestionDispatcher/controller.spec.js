const makeController = require('../../../../src/functions/ingestionDispatcher/controller')
const { InternalServerErrorException } = require('../../../../src/common/errors')

const makeSut = () => {
  const serviceStub = jest.fn(async () => Promise.resolve({}))

  const controller = makeController({
    service: serviceStub
  })

  return {
    sut: controller,
    serviceStub
  }
}

describe('IngestionDispatcher Controller', () => {
  it('Should throw an InternalServerErrorException if service throws an Error', async () => {
    const { sut, serviceStub } = makeSut()
    serviceStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut()
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should return success with statusCode 200', async () => {
    const { sut, serviceStub } = makeSut()
    const result = await sut()
    expect(serviceStub).toHaveBeenCalled()
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({})
  })
})
