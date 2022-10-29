const makeController = require('../../../../src/v1/dataExport/controller')
const { ValidationError, InternalServerError } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const mockRequest = {
    payload: { records: [{ body: `{"companyId":["${companyId}"]}` }] }
  }

  const validateRequestSchemaStub = jest.fn(() => ({ companyId }))
  const mockSchema = {}
  const useCaseStub = jest.fn(async () => Promise.resolve({ success: true }))

  const controller = makeController({
    validateRequestSchema: validateRequestSchemaStub,
    schema: mockSchema,
    useCase: useCaseStub
  })

  return {
    sut: controller,
    validateRequestSchemaStub,
    useCaseStub,
    mockRequest,
    mockSchema
  }
}

describe('dataExport Controller', () => {
  it('Should throw an InternalServerError if validateRequestSchema throws an Error', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(mockRequest)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should throw an ValidationError if validateRequestSchema throws a ValidationError', async () => {
    const { sut, validateRequestSchemaStub, mockRequest } = makeSut()
    validateRequestSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    mockRequest.payload.records[0].body.companyId = 'invalid_companyId'
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
    const { sut, validateRequestSchemaStub, useCaseStub, mockRequest, mockSchema } = makeSut()
    const result = await sut(mockRequest)
    expect(validateRequestSchemaStub).toHaveBeenCalledWith({ companyId: [companyId] }, mockSchema)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })

  it('Should return success: http request', async () => {
    const { sut, validateRequestSchemaStub, useCaseStub, mockSchema } = makeSut()
    const mockRequest = { payload: { companyId } }
    const result = await sut(mockRequest)
    expect(validateRequestSchemaStub).toHaveBeenCalledWith(mockRequest.payload, mockSchema)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
