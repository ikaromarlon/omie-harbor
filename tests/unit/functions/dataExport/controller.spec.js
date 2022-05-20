const makeController = require('../../../../src/functions/dataExport/controller')
const { ValidationError, InternalServerError } = require('../../../../src/utils/errors')

const cnpj = '25292334000107'

const makeSut = () => {
  const requestMock = {
    payload: { records: [{ body: { cnpj } }] }
  }

  const validatePayloadSchemaStub = jest.fn(({ payload, schema }) => cnpj)
  const schemaMock = {}
  const useCaseStub = jest.fn(async ({ payload }) => Promise.resolve({ success: true }))
  const loggerMock = {
    info: jest.fn((data) => null),
    error: jest.fn((data) => null)
  }

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

describe('dataExport Controller', () => {
  it('Should throw an InternalServerError if validatePayloadSchema throws an Error', async () => {
    const { sut, validatePayloadSchemaStub, loggerMock, requestMock } = makeSut()
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

  it('Should throw an InternalServerError if useCase throws an Error', async () => {
    const { sut, useCaseStub, loggerMock, requestMock } = makeSut()
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

  it('Should throw an ValidationError if validatePayloadSchema throws a ValidationError', async () => {
    const { sut, validatePayloadSchemaStub, loggerMock, requestMock } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    requestMock.payload.records[0].body.cnpj = 'invalid_cnpj'
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
      expect(loggerMock.error).toHaveBeenCalledTimes(1)
    }
  })

  it('Should call validatePayloadSchema successfully', async () => {
    const { sut, validatePayloadSchemaStub, requestMock, schemaMock } = makeSut()
    await sut(requestMock)
    expect(validatePayloadSchemaStub).toHaveBeenCalledWith(requestMock.payload.records[0].body, schemaMock)
  })

  it('Should call useCase successfully', async () => {
    const { sut, useCaseStub, requestMock } = makeSut()
    await sut(requestMock)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: cnpj })
  })

  it('Should call logger.info successfully', async () => {
    const { sut, loggerMock, requestMock } = makeSut()
    await sut(requestMock)
    expect(loggerMock.info).toHaveBeenCalledTimes(2)
  })

  it('Should return success: queue request (default)', async () => {
    const { sut, requestMock } = makeSut()
    const result = await sut(requestMock)
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })

  it('Should return success: http request', async () => {
    const { sut } = makeSut()
    const requestMock = { payload: { cnpj } }
    const result = await sut(requestMock)
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
