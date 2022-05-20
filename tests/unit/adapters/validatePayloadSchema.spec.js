const validatePayloadSchema = require('../../../src/adapters/validatePayloadSchema')
const { ValidationError } = require('../../../src/utils/errors')

const makeSut = () => {
  const payloadMock = { key1: 'string', key2: 1010, key3: '2021-01-31T00:00:00.000', key4: true, key5: 'string' }
  const schemaMock = { validate: (data, options) => ({ value: { ...payloadMock } }) }

  return {
    sut: validatePayloadSchema,
    payloadMock,
    schemaMock
  }
}

describe('ValidatePayloadSchema Adapter', () => {
  it('Should throw an Error with valid payload but invalid Joi object schema', () => {
    const { sut, payloadMock } = makeSut()
    const schemaMock = { description: 'any object that is not a Joi object schema' }
    try {
      sut(payloadMock, schemaMock)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
    }
  })

  it('Should throw a ValidationError with valid Joi object schema but invalid payload: missing required parameter', () => {
    const { sut, schemaMock } = makeSut()
    const payloadMock = { key1: 'string', key2: 1010, key3: '2021-01-31T00:00:00.000', key5: 'string' }
    jest.spyOn(schemaMock, 'validate').mockReturnValueOnce({ error: { message: '"key4" is required' } })
    try {
      sut(payloadMock, schemaMock)
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe('"key4" is required')
    }
  })

  it('Should validate payload successfully', () => {
    const { sut, payloadMock, schemaMock } = makeSut()
    const result = sut(payloadMock, schemaMock)
    expect(result).toEqual(payloadMock)
  })
})
