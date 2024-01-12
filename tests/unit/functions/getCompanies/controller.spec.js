const makeController = require('../../../../src/functions/getCompanies/controller')
const { UnprocessableEntityException, InternalServerErrorException } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const mockRequest = {
    params: { companyId }
  }

  const validateWithSchemaStub = jest.fn(() => (mockRequest.params))
  const mockSchema = {}
  const serviceStub = jest.fn(async () => Promise.resolve({ success: true }))

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

describe('getCompanies Controller', () => {
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
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
    mockRequest.params.companyId = 'invalid_companyId'
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
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

  it('Should return success: http request', async () => {
    const { sut, validateWithSchemaStub, serviceStub, mockSchema, mockRequest } = makeSut()
    const result = await sut(mockRequest)
    expect(validateWithSchemaStub).toHaveBeenCalledWith(mockRequest.params, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith({ companyId })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
