const omieErrorHandler = require('../../../../src/services/utils/omieErrorHandler')
const { ExternalServerError } = require('../../../../src/utils/errors')

const makeSut = () => {
  const omieErrorMock = new Error('Omie HTTP error response message')
  omieErrorMock.response = {
    status: 500,
    data: {
      faultcode: 'SOAP-ENV:Server',
      faultstring: 'The server error message'
    }
  }

  return {
    sut: omieErrorHandler,
    omieErrorMock
  }
}

describe('Services Omie Error Handler Adapter', () => {
  it('Should throw an ExternalServerError if omieError should not be ignored', async () => {
    const { sut, omieErrorMock } = makeSut()
    try {
      await sut(omieErrorMock, 'any value of any type could be informed here')
    } catch (error) {
      expect(error).toBeInstanceOf(ExternalServerError)
      expect(error.statusCode).toBe(502)
      expect(error.message).toBe('Omie Service Request Error')
      expect(error.externalCallData).toBeTruthy()
      expect(error.externalCallData.message).toBe('Omie HTTP error response message')
      expect(error.externalCallData.response).toEqual(omieErrorMock.response)
    }
  })

  it('Should return a value if omieError should be ignored', async () => {
    const { sut, omieErrorMock } = makeSut()
    omieErrorMock.response.data.faultcode = 'SOAP-ENV:Client-8020'
    const result = await sut(omieErrorMock, 'any value of any type could be informed here')
    expect(result).toBe('any value of any type could be informed here')
  })

  it('Should force throw an ExternalServerError if omieError should not be ignored', async () => {
    const { sut, omieErrorMock } = makeSut()
    try {
      omieErrorMock.response.data.faultcode = 'SOAP-ENV:Client-8020'
      const forceThrow = true
      await sut(omieErrorMock, 'any value of any type could be informed here', forceThrow)
    } catch (error) {
      expect(error).toBeInstanceOf(ExternalServerError)
      expect(error.statusCode).toBe(502)
      expect(error.message).toBe('Omie Service Request Error')
      expect(error.externalCallData).toBeTruthy()
      expect(error.externalCallData.message).toBe('Omie HTTP error response message')
      expect(error.externalCallData.response).toEqual(omieErrorMock.response)
    }
  })
})
