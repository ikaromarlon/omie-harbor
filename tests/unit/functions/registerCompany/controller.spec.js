const makeController = require('../../../../src/functions/registerCompany/controller')
const { UnprocessableEntityException, InternalServerErrorException } = require('../../../../src/common/errors')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockRequest = {
    payload: { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  }

  const validateRequestSchemaStub = jest.fn(() => mockRequest.payload)
  const mockSchema = {}
  const serviceStub = jest.fn(async () => Promise.resolve(mockSavedOmieCompanies[0]))

  const controller = makeController({
    schema: mockSchema,
    validateRequestSchema: validateRequestSchemaStub,
    service: serviceStub
  })

  return {
    sut: controller,
    validateRequestSchemaStub,
    serviceStub,
    mockRequest,
    mockSchema
  }
}

describe('registerCompany Controller', () => {
  it('Should throw an InternalServerErrorException if validateRequestSchema throws an Error', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should throw an UnprocessableEntityException if validateRequestSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('appSecret is required') })
    mockRequest.payload = { appKey: 'the_app_key' }
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('appSecret is required')
    }
  })

  it('Should throw an InternalServerErrorException if service throws an Error', async () => {
    const { sut, serviceStub, mockRequest } = makeSut()
    serviceStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should call validateRequestSchema successfully', async () => {
    const { sut, validateRequestSchemaStub, serviceStub, mockRequest, mockSchema } = makeSut()
    const result = await sut(mockRequest)
    expect(validateRequestSchemaStub).toHaveBeenCalledWith(mockRequest.payload, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith({ payload: mockRequest.payload })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(mockSavedOmieCompanies[0])
  })
})
