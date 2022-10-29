const makeController = require('../../../../src/v1/deleteDataByCompany/controller')
const { ValidationError, InternalServerError } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const mockRequest = {
    payload: { companyId }
  }

  const validateRequestSchemaStub = jest.fn(() => (mockRequest.payload))
  const mockSchema = {}
  const useCaseStub = jest.fn(async () => Promise.resolve({ success: true }))

  const controller = makeController({
    validateRequestSchema: validateRequestSchemaStub,
    schema: mockSchema,
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

describe('deleteDataByCompany Controller', () => {
  it('Should throw an InternalServerError if validateRequestSchema throws an Error', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should throw an ValidationError if validateRequestSchema throws a ValidationError', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    mockRequest.payload.companyId = 'invalid_companyId'
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

  it('Should return success: http request', async () => {
    const { sut, validateRequestSchemaStub, useCaseStub, mockSchema } = makeSut()
    const mockRequest = { payload: { companyId } }
    const result = await sut(mockRequest)
    expect(validateRequestSchemaStub).toHaveBeenCalledWith(mockRequest.payload, mockSchema)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
