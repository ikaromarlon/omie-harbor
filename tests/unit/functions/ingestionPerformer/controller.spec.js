const makeController = require('../../../../src/functions/ingestionPerformer/controller')
const { ValidationError, InternalServerError } = require('../../../../src/utils/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const requestMock = {
    payload: { records: [{ body: `{"companyId":["${companyId}"]}` }] }
  }
  const loggerMock = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const validatePayloadSchemaStub = jest.fn(() => ({ companyId }))
  const schemaMock = {}
  const useCaseStub = jest.fn(async () => Promise.resolve({ success: true }))

  const controller = makeController({
    validatePayloadSchema: validatePayloadSchemaStub,
    schema: schemaMock,
    useCase: useCaseStub,
    logger: loggerMock
  })

  return {
    sut: controller,
    validatePayloadSchemaStub,
    useCaseStub,
    requestMock,
    schemaMock,
    loggerMock
  }
}

describe('IngestionPerformer Controller', () => {
  it('Should throw an InternalServerError if validatePayloadSchema throws an Error', async () => {
    const { sut, validatePayloadSchemaStub, requestMock, loggerMock } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
      expect(loggerMock.error).toHaveBeenCalledTimes(1)
    }
  })

  it('Should throw an ValidationError if validatePayloadSchema throws a ValidationError', async () => {
    const { sut, validatePayloadSchemaStub, requestMock, loggerMock } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    requestMock.payload.companyId = 'invalid_companyId'
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
      expect(loggerMock.error).toHaveBeenCalledTimes(1)
    }
  })

  it('Should throw an InternalServerError if useCase throws an Error', async () => {
    const { sut, useCaseStub, requestMock, loggerMock } = makeSut()
    useCaseStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
      expect(loggerMock.error).toHaveBeenCalledTimes(1)
    }
  })

  it('Should return success: queue request (default)', async () => {
    const { sut, validatePayloadSchemaStub, useCaseStub, loggerMock, requestMock, schemaMock } = makeSut()
    const result = await sut(requestMock)
    expect(validatePayloadSchemaStub).toHaveBeenCalledWith({ companyId: [companyId] }, schemaMock)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(loggerMock.info).toHaveBeenCalledTimes(2)
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })

  it('Should return success: http request', async () => {
    const { sut, validatePayloadSchemaStub, useCaseStub, loggerMock, schemaMock } = makeSut()
    const requestMock = { payload: { companyId } }
    const result = await sut(requestMock)
    expect(validatePayloadSchemaStub).toHaveBeenCalledWith(requestMock.payload, schemaMock)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: { companyId } })
    expect(loggerMock.info).toHaveBeenCalledTimes(2)
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
