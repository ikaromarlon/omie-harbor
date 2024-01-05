const makeController = require('../../../../src/functions/registerOmieCompany/controller')
const { ValidationError, InternalServerError } = require('../../../../src/common/errors')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockUserId = '5429ae58-b264-4f3b-ba63-3dd304b272a1'

  const mockRequest = {
    headers: { 'X-User-Id': mockUserId },
    payload: { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  }

  const validateRequestSchemaStub = jest.fn(() => mockRequest.payload)
  const mockSchema = {}
  const useCaseStub = jest.fn(async () => Promise.resolve(mockSavedOmieCompanies[0]))

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
    mockSchema,
    mockUserId
  }
}

describe('RegisterOmieCompany Controller', () => {
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
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new ValidationError('appSecret is required') })
    mockRequest.payload = { appKey: 'the_app_key' }
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('appSecret is required')
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

  it('Should call validateRequestSchema successfully', async () => {
    const { sut, validateRequestSchemaStub, useCaseStub, mockRequest, mockSchema, mockUserId } = makeSut()
    const result = await sut(mockRequest)
    expect(validateRequestSchemaStub).toHaveBeenCalledWith(mockRequest.payload, mockSchema)
    expect(useCaseStub).toHaveBeenCalledWith({ userId: mockUserId, payload: mockRequest.payload })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(mockSavedOmieCompanies[0])
  })
})
