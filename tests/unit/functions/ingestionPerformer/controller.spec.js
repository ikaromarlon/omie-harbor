const makeController = require('../../../../src/functions/ingestionPerformer/controller')
const { ValidationError, InternalServerError } = require('../../../../src/utils/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const mockRequest = {
    payload: { records: [{ body: `{"companyId":["${companyId}"]}` }] }
  }

  const validatePayloadSchemaStub = jest.fn(() => ({ companyId }))
  const mockSchema = {}
  const useCaseStub = jest.fn(async () => Promise.resolve({ success: true }))

  const controller = makeController({
    validatePayloadSchema: validatePayloadSchemaStub,
    schema: mockSchema,
    useCase: useCaseStub
  })

  return {
    sut: controller,
    validatePayloadSchemaStub,
    useCaseStub,
    mockRequest,
    mockSchema
  }
}

describe('IngestionPerformer Controller', () => {
  it('Should throw an InternalServerError if validatePayloadSchema throws an Error', async () => {
    const { sut, validatePayloadSchemaStub, mockRequest } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should throw an ValidationError if validatePayloadSchema throws a ValidationError', async () => {
    const { sut, validatePayloadSchemaStub, mockRequest } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    mockRequest.payload.companyId = 'invalid_companyId'
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should throw an InternalServerError if useCase throws an Error', async () => {
    const { sut, useCaseStub, mockRequest } = makeSut()
    useCaseStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should return success: queue request (default)', async () => {
    const { sut, validatePayloadSchemaStub, useCaseStub, mockRequest, mockSchema } = makeSut()
    const result = await sut(mockRequest)
    expect(validatePayloadSchemaStub).toHaveBeenCalledWith({ companyId: [companyId] }, mockSchema)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })

  it('Should return success: http request', async () => {
    const { sut, validatePayloadSchemaStub, useCaseStub, mockSchema } = makeSut()
    const mockRequest = { payload: { companyId } }
    const result = await sut(mockRequest)
    expect(validatePayloadSchemaStub).toHaveBeenCalledWith(mockRequest.payload, mockSchema)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
