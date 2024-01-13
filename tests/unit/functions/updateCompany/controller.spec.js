const makeController = require('../../../../src/functions/updateCompany/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const mockRequest = {
    params: { companyId },
    body: { isActive: false }
  }

  const validateWithSchemaStub = jest.fn(() => ({ ...mockRequest.params, ...mockRequest.body }))
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

describe('updateCompany Controller', () => {
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

  it('Should return success', async () => {
    const { sut, validateWithSchemaStub, serviceStub, mockSchema, mockRequest } = makeSut()
    const result = await sut(mockRequest)
    expect(validateWithSchemaStub).toHaveBeenCalledWith({ ...mockRequest.params, ...mockRequest.body }, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith({ ...mockRequest.params, ...mockRequest.body })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
