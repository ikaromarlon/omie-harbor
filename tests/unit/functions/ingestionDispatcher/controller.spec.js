const makeController = require('../../../../src/functions/ingestionDispatcher/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const request = {}

  const validateWithSchemaStub = jest.fn(() => ({ companyId }))
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

describe('ingestionDispatcher - controller', () => {
  describe('EventBridge trigger', () => {
    it('Should return success', async () => {
      const { sut, validateWithSchemaStub, serviceStub, request } = makeSut()
      const result = await sut(request)
      expect(validateWithSchemaStub).toHaveBeenCalledTimes(0)
      expect(serviceStub).toHaveBeenCalledWith({})
      expect(result.statusCode).toBe(200)
      expect(result.data).toEqual({ success: true })
    })
  })

  describe('API Gateway HTTP trigger', () => {
    it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
      const { sut, validateWithSchemaStub, request } = makeSut()
      validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
      request.body = { companyId: 'invalid_companyId' }
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
      request.body = { companyId }
      const result = await sut(request)
      expect(validateWithSchemaStub).toHaveBeenCalledWith(request.body, mockSchema)
      expect(serviceStub).toHaveBeenCalledWith({ companyId })
      expect(result.statusCode).toBe(200)
      expect(result.data).toEqual({ success: true })
    })
  })
})
