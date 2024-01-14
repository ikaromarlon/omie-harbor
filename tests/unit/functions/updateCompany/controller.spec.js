const makeController = require('../../../../src/functions/updateCompany/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const request = {
    params: { companyId },
    body: { isActive: false }
  }

  const validateWithSchemaStub = jest.fn(() => ({ ...request.params, ...request.body }))
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
    request,
    mockSchema
  }
}

describe('updateCompany - controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateWithSchemaStub, request } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
    request.params.companyId = 'invalid_companyId'
    try {
      await sut(request)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should return success', async () => {
    const { sut, validateWithSchemaStub, serviceStub, mockSchema, request } = makeSut()
    const result = await sut(request)
    expect(validateWithSchemaStub).toHaveBeenCalledWith({ ...request.params, ...request.body }, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith({ ...request.params, ...request.body })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
