const makeController = require('../../../../src/functions/ingestionDispatcher/controller')
const { InternalServerError } = require('../../../../src/common/errors')

const makeSut = () => {
  const useCaseStub = jest.fn(async () => Promise.resolve({}))

  const controller = makeController({
    useCase: useCaseStub
  })

  return {
    sut: controller,
    useCaseStub
  }
}

describe('IngestionDispatcher Controller', () => {
  it('Should throw an InternalServerError if useCase throws an Error', async () => {
    const { sut, useCaseStub } = makeSut()
    useCaseStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut()
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should return success with statusCode 200', async () => {
    const { sut, useCaseStub } = makeSut()
    const result = await sut()
    expect(useCaseStub).toHaveBeenCalled()
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({})
  })
})
