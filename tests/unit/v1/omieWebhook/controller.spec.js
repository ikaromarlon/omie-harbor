const makeController = require('../../../../src/v1/omieWebhook/controller')
const { InternalServerError, ValidationError } = require('../../../../src/common/errors')

const makeSut = () => {
  const mockRequest = {
    headers: {},
    payload: {}
  }

  const validateRequestSchemaStub = jest.fn(() => mockRequest.payload)
  const mockSchema = {}
  const useCaseStub = jest.fn(async () => null)

  const controller = makeController({
    schema: mockSchema,
    validateRequestSchema: validateRequestSchemaStub,
    useCase: useCaseStub
  })

  return {
    sut: controller,
    validateRequestSchemaStub,
    useCaseStub,
    mockRequest,
    mockSchema
  }
}

describe('omieWebhook Controller', () => {
  it('Should throw an ValidationError if validateRequestSchema throws a ValidationError', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    mockRequest.payload.id = 'invalid_field'
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should throw an InternalServerError if useCase throws an Error', async () => {
    const { sut, useCaseStub, mockRequest } = makeSut()
    useCaseStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should return success with statusCode 200', async () => {
    const { sut, useCaseStub, mockRequest } = makeSut()
    const result = await sut(mockRequest)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: mockRequest.payload })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(null)
  })
})