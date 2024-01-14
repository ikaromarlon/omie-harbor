const makeController = require('../../../../src/functions/ingestionPerformer/controller')
const { UnprocessableEntityException } = require('../../../../src/common/errors')

const companyId = '25c176b6-b200-4575-9217-e23c6105163c'

const makeSut = () => {
  const request = {
    records: [{
      body: {
        companyId: [companyId]
      }
    }]
  }

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

describe('IngestionPerformer - controller', () => {
  it('Should throw an UnprocessableEntityException if validateWithSchema throws a UnprocessableEntityException', async () => {
    const { sut, validateWithSchemaStub, request } = makeSut()
    validateWithSchemaStub.mockImplementationOnce(() => { throw new UnprocessableEntityException('Invalid field') })
    request.records[0].body.companyId = 'invalid_companyId'
    try {
      await sut(request)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('Invalid field')
    }
  })

  it('Should return success: queue request (default)', async () => {
    const { sut, validateWithSchemaStub, serviceStub, request, mockSchema } = makeSut()
    const result = await sut(request)
    expect(validateWithSchemaStub).toHaveBeenCalledWith({ companyId: [companyId] }, mockSchema)
    expect(serviceStub).toHaveBeenCalledWith({ companyId })
    expect(result.statusCode).toBe(200)
    expect(result.data).toEqual({ success: true })
  })
})
