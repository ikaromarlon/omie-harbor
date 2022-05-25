const axios = require('axios')
const makeRequester = require('../../../src/utils/requester')

jest.mock('axios', () => ({
  get: async () => Promise.resolve({ status: 200, headers: {}, data: { success: true } }),
  post: async () => Promise.resolve({ status: 200, headers: {}, data: { success: true } })
}))

const makeSut = () => {
  const errorMock = {
    message: 'Internal server error',
    config: {
      method: 'post',
      url: 'http://localhost',
      data: {},
      headers: { 'User-Agent': 'axios/0.0.1' }
    },
    response: {
      status: 500,
      data: { message: 'Internal server error' },
      headers: {}
    }
  }

  return {
    sut: makeRequester(),
    errorMock
  }
}

describe('Services Requester Adapter', () => {
  describe('GET', () => {
    it('Should call get and return response successfully', async () => {
      const { sut } = makeSut()
      const spyGet = jest.spyOn(axios, 'get')
      const result = await sut.get('url')
      expect(spyGet).toHaveBeenCalledWith('url', { headers: {} })
      expect(result).toBeTruthy()
      expect(result.startDate).toBeTruthy()
      expect(result.endDate).toBeTruthy()
      expect(result.responseTime).toBeTruthy()
      expect(result.statusCode).toBeTruthy()
      expect(result.headers).toBeTruthy()
      expect(result.data).toBeTruthy()
      expect(result.data.success).toBe(true)
    })

    it('Should call get and throw an error', async () => {
      const { sut, errorMock } = makeSut()
      errorMock.config.method = 'get'
      jest.spyOn(axios, 'get').mockRejectedValueOnce(errorMock)
      try {
        await sut.get('url')
      } catch (error) {
        expect(error).toBeTruthy()
        expect(error.startDate).toBeTruthy()
        expect(error.endDate).toBeTruthy()
        expect(error.responseTime).toBeTruthy()
        expect(error.agent).toBeTruthy()
        expect(error.agent.name).toBe('axios')
        expect(error.agent.version).toBe('0.0.1')
        expect(error.request).toEqual(errorMock.config)
        expect(error.response).toEqual({ statusCode: 500, data: { message: 'Internal server error' }, headers: {} })
      }
    })
  })

  describe('POST', () => {
    it('Should call post and return response successfully', async () => {
      const { sut } = makeSut()
      const spyPost = jest.spyOn(axios, 'post')
      const result = await sut.post('url', {})
      expect(spyPost).toHaveBeenCalledWith('url', {}, { headers: {} })
      expect(result).toBeTruthy()
      expect(result.startDate).toBeTruthy()
      expect(result.endDate).toBeTruthy()
      expect(result.responseTime).toBeTruthy()
      expect(result.statusCode).toBeTruthy()
      expect(result.headers).toBeTruthy()
      expect(result.data).toBeTruthy()
      expect(result.data.success).toBe(true)
    })

    it('Should call post and throw an error', async () => {
      const { sut, errorMock } = makeSut()
      errorMock.config.method = 'post'
      jest.spyOn(axios, 'post').mockRejectedValueOnce(errorMock)
      try {
        await sut.post('url')
      } catch (error) {
        expect(error).toBeTruthy()
        expect(error.startDate).toBeTruthy()
        expect(error.endDate).toBeTruthy()
        expect(error.responseTime).toBeTruthy()
        expect(error.agent).toBeTruthy()
        expect(error.agent.name).toBe('axios')
        expect(error.agent.version).toBe('0.0.1')
        expect(error.request).toEqual(errorMock.config)
        expect(error.response).toEqual({ statusCode: 500, data: { message: 'Internal server error' }, headers: {} })
      }
    })
  })
})
