const omieErrorHandler = require('../../../../src/services/utils/omieErrorHandler')
const { ExternalServerError } = require('../../../../src/common/errors')

const makeSut = () => {
  const mockOmieError = new Error('Omie HTTP error response message')
  mockOmieError.response = {
    status: 500,
    data: {
      faultcode: 'SOAP-ENV:Server',
      faultstring: 'The server error message'
    }
  }

  return {
    sut: omieErrorHandler,
    mockOmieError
  }
}

describe('Services Omie Error Handler Adapter', () => {
  it('Should throw an ExternalServerError if omieError should not be ignored', async () => {
    const { sut, mockOmieError } = makeSut()
    try {
      await sut(mockOmieError, 'any value of any type could be informed here')
    } catch (error) {
      expect(error).toBeInstanceOf(ExternalServerError)
      expect(error.statusCode).toBe(502)
      expect(error.message).toBe('Omie Service Request Error: [SOAP-ENV:Server] The server error message')
      expect(error.data).toBeTruthy()
      expect(error.data.message).toBe('Omie HTTP error response message')
      expect(error.data.response).toEqual(mockOmieError.response)
    }
  })

  it('Should return a value if omieError should be ignored', async () => {
    const { sut, mockOmieError } = makeSut()
    mockOmieError.response.data.faultcode = 'SOAP-ENV:Client-8020'
    const result = await sut(mockOmieError, 'any value of any type could be informed here')
    expect(result).toBe('any value of any type could be informed here')
  })

  it('Should force throw an ExternalServerError if omieError should not be ignored', async () => {
    const { sut, mockOmieError } = makeSut()
    try {
      mockOmieError.response.data.faultcode = 'SOAP-ENV:Client-8020'
      const forceThrow = true
      await sut(mockOmieError, 'any value of any type could be informed here', forceThrow)
    } catch (error) {
      expect(error).toBeInstanceOf(ExternalServerError)
      expect(error.statusCode).toBe(502)
      expect(error.message).toBe('Omie Service Request Error: [SOAP-ENV:Client-8020] The server error message')
      expect(error.data).toBeTruthy()
      expect(error.data.message).toBe('Omie HTTP error response message')
      expect(error.data.response).toEqual(mockOmieError.response)
    }
  })
})
