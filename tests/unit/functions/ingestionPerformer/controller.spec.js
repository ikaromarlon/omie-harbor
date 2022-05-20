const makeController = require('../../../../src/functions/ingestionPerformer/controller')
const { ValidationError, InternalServerError } = require('../../../../src/utils/errors')

const cnpj = '25292334000107'

const makeSut = () => {
  const requestMock = {
    payload: { records: [{ body: `{"cnpj":["${cnpj}"]}` }] }
  }
  const logger = {
    info: () => {},
    error: () => {}
  }
  const validatePayloadSchemaStub = jest.fn(({ payload, schema }) => requestMock.payload)
  const schemaMock = {}
  const useCaseStub = jest.fn(async ({ payload }) => Promise.resolve({ success: true }))

  const controller = makeController({
    validatePayloadSchema: validatePayloadSchemaStub,
    schema: schemaMock,
    useCase: useCaseStub,
    logger
  })

  return {
    sut: controller,
    validatePayloadSchemaStub,
    useCaseStub,
    requestMock,
    schemaMock
  }
}

describe('IngestionPerformer Controller', () => {
  it('Should throw an InternalServerError if validatePayloadSchema throws an Error', async () => {
    const { sut, validatePayloadSchemaStub, requestMock } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new Error('Generic error') })
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should throw an ValidationError if validatePayloadSchema throws a ValidationError', async () => {
    const { sut, validatePayloadSchemaStub, requestMock } = makeSut()
    validatePayloadSchemaStub.mockImplementationOnce(() => { throw new ValidationError('Invalid field') })
    requestMock.payload.cnpj = 'invalid_cnpj'
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should throw an InternalServerError if useCase throws an Error', async () => {
    const { sut, useCaseStub, requestMock } = makeSut()
    useCaseStub.mockRejectedValueOnce(new Error('Generic error'))
    try {
      await sut(requestMock)
    } catch (error) {
      expect(error).toBeInstanceOf(InternalServerError)
      expect(error.statusCode).toBe(500)
      expect(error.message).toBe('Generic error')
    }
  })

  it('Should call validatePayloadSchema successfully', async () => {
    const { sut, validatePayloadSchemaStub, requestMock, schemaMock } = makeSut()
    await sut(requestMock)
    expect(validatePayloadSchemaStub).toHaveBeenCalledWith({ cnpj: [cnpj] }, schemaMock)
  })

  it('Should call useCase successfully', async () => {
    const { sut, useCaseStub, requestMock } = makeSut()
    await sut(requestMock)
    expect(useCaseStub).toHaveBeenCalledWith({ payload: requestMock.payload })
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
