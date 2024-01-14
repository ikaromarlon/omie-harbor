const makeController = require('../../../../src/functions/registerCompany/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const request = {
    body: { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  }

  const validateWithSchemaStub = jest.fn(() => request.body)
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
    request,
    mockSchema
  }
}

describe('registerCompany - controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateWithSchemaStub, request } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('appSecret is required') })
    request.body = { appKey: 'the_app_key' }
    try {
      await sut(request)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('appSecret is required')
    }
  })

  it('Should call validateWithSchema successfully', async () => {
    const { sut, validateWithSchemaStub, serviceStub, request, mockSchema } = makeSut()
    const result = await sut(request)
    expect(validateWithSchemaStub).toHaveBeenCalledWith(request.body, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith(request.body)
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual(mockSavedOmieCompanies[0])
  })
})
