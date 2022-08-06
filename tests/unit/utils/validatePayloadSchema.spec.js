const validatePayloadSchema = require('../../../src/utils/validatePayloadSchema')
const { ValidationError } = require('../../../src/utils/errors')

const makeSut = () => {
  const mockPayload = { key1: 'string', key2: 1010, key3: '2021-01-31T00:00:00.000', key4: true, key5: 'string' }
  const mockSchema = { validate: (data, options) => ({ value: { ...mockPayload } }) }

  return {
    sut: validatePayloadSchema,
    mockPayload,
    mockSchema
  }
}

describe('ValidatePayloadSchema Adapter', () => {
  it('Should throw an Error with valid payload but invalid Joi object schema', () => {
    const { sut, mockPayload } = makeSut()
    const mockSchema = { description: 'any object that is not a Joi object schema' }
    try {
      sut(mockPayload, mockSchema)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('Should throw a ValidationError with valid Joi object schema but invalid payload: missing required parameter', () => {
    const { sut, mockSchema } = makeSut()
    const mockPayload = { key1: 'string', key2: 1010, key3: '2021-01-31T00:00:00.000', key5: 'string' }
    jest.spyOn(mockSchema, 'validate').mockReturnValueOnce({ error: { message: '"key4" is required' } })
    try {
      sut(mockPayload, mockSchema)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('"key4" is required')
    }
  })

  it('Should validate payload successfully', () => {
    const { sut, mockPayload, mockSchema } = makeSut()
    const result = sut(mockPayload, mockSchema)
    expect(result).toEqual(mockPayload)
  })
})
