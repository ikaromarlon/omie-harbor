const makeController = require('../../../../src/functions/getCompanyData/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')

const makeSut = () => {
  const request = {
    params: {
      id: '25c176b6-b200-4575-9217-e23c6105163c'
    }
  }

  const validateWithSchemaStub = jest.fn(() => request.params)
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
    request,
    mockSchema
  }
}

describe('getCompanyData - controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws an error', async () => {
    const { sut, validateWithSchemaStub, request } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
    request.params.id = 'invalid_id'
    try {
      await sut(request)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should return headers redirecting to json data successfully with statusCode 303', async () => {
    const { sut, validateWithSchemaStub, request, mockSchema, serviceStub } = makeSut()
    const result = await sut(request)
    expect(validateWithSchemaStub).toHaveBeenCalledWith(request.params, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith(request.params)
    expect(result.statusCode).toBe(303)
    expect(result.headers.Location).toBe('https://the-bucket-url/data.json')
  })
})
