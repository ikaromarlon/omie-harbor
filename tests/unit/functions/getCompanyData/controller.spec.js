const makeController = require('../../../../src/functions/getCompanyData/controller')
const { UnprocessableEntityException, InternalServerErrorException } = require('../../../../src/common/errors')

const makeSut = () => {
  const mockRequest = {
    params: {
      id: '25c176b6-b200-4575-9217-e23c6105163c'
    }
  }

  const validateWithSchemaStub = jest.fn(() => mockRequest.params)
  const mockSchema = {}
  const serviceStub = jest.fn(async () => Promise.resolve('https://the-bucket-url/data.json'))

  const controller = makeController({
    validateWithSchema: validateWithSchemaStub,
    schema: mockSchema,
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

describe('getCompanyData Controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws an error', async () => {
    const { sut, validateWithSchemaStub, mockRequest } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
    mockRequest.params.id = 'invalid_id'
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should throw an InternalServerErrorException if useCase throws an error', async () => {
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

  it('Should return headers redirecting to json data successfully with statusCode 303', async () => {
    const { sut, validateWithSchemaStub, mockRequest, mockSchema, serviceStub } = makeSut()
    const result = await sut(mockRequest)
    expect(validateWithSchemaStub).toHaveBeenCalledWith(mockRequest.params, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith(mockRequest.params)
    expect(result.statusCode).toBe(303)
    expect(result.headers.Location).toBe('https://the-bucket-url/data.json')
  })
})
