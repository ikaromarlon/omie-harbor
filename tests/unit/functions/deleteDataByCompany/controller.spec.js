const makeController = require('../../../../src/functions/deleteDataByCompany/controller')
const { UnprocessableEntityException, InternalServerErrorException } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const mockRequest = {
    payload: { companyId }
  }

  const validateRequestSchemaStub = jest.fn(() => (mockRequest.payload))
  const mockSchema = {}
  const serviceStub = jest.fn(async () => Promise.resolve({ success: true }))

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

describe('deleteDataByCompany Controller', () => {
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
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
    mockRequest.payload.companyId = 'invalid_companyId'
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
    const { sut, validateRequestSchemaStub, serviceStub, mockSchema } = makeSut()
    const mockRequest = { payload: { companyId } }
    const result = await sut(mockRequest)
    expect(validateRequestSchemaStub).toHaveBeenCalledWith(mockRequest.payload, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
