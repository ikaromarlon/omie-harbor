const makeController = require('../../../../src/functions/webhook/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')

const makeSut = () => {
  const request = {
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
    request,
    mockSchema
  }
}

describe('webhook - controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateWithSchemaStub, request } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid value') })
    request.records[0].body = '{"anyField":"invalid_value"}'
    try {
      await sut(request)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid value')
    }
  })

  it('Should return success', async () => {
    const { sut, serviceStub, request } = makeSut()
    const result = await sut(request)
    expect(serviceStub).toHaveBeenCalledWith({})
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(null)
  })
})
