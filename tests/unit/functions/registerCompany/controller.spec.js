const makeController = require('../../../../src/functions/registerCompany/controller')
const { UnprocessableEntityException, InternalServerErrorException } = require('../../../../src/common/errors')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockRequest = {
    body: { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  }

  const validateWithSchemaStub = jest.fn(() => mockRequest.body)
  const mockSchema = {}
  const serviceStub = jest.fn(async () => Promise.resolve(mockSavedOmieCompanies[0]))

  const controller = makeController({
    schema: mockSchema,
    validateWithSchema: validateWithSchemaStub,
    service: serviceStub
  })

  return {
    sut: controller,
    validateWithSchemaStub,
    serviceStub,
    mockRequest,
    mockSchema
  }
}

describe('registerCompany Controller', () => {
  it('Should throw an InternalServerErrorException if validateWithSchema throws an Error', async () => {
    const { sut, validateWithSchemaStub, mockRequest } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerErrorException)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateWithSchemaStub, mockRequest } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('appSecret is required') })
    mockRequest.body = { appKey: 'the_app_key' }
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

  it('Should call validateWithSchema successfully', async () => {
    const { sut, validateWithSchemaStub, serviceStub, mockRequest, mockSchema } = makeSut()
    const result = await sut(mockRequest)
    expect(validateWithSchemaStub).toHaveBeenCalledWith(mockRequest.body, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith(mockRequest.body)
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(mockSavedOmieCompanies[0])
  })
})
