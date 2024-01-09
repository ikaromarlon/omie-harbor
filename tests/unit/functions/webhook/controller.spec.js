const makeController = require('../../../../src/functions/webhook/controller')
const { InternalServerErrorException, UnprocessableEntityException } = require('../../../../src/common/errors')

const makeSut = () => {
  const mockRequest = {
    records: [{
      body: '{}'
    }]
  }

  const validateWithSchemaStub = jest.fn(() => ({}))
  const mockSchema = {}
  const serviceStub = jest.fn(async () => null)

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

describe('webhook Controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateWithSchemaStub, mockRequest } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid value') })
    mockRequest.records[0].body = '{"anyField":"invalid_value"}'
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid value')
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

  it('Should return success', async () => {
    const { sut, serviceStub, mockRequest } = makeSut()
    const result = await sut(mockRequest)
    expect(serviceStub).toHaveBeenCalledWith({})
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(null)
  })
})
