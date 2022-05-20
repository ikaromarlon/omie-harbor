const makeRequester = require('../../../src/adapters/bucket')
const { NotFoundError } = require('../../../src/utils/errors')

const mockPutObject = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))
const mockHeadObject = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))
const mockGetSignedUrl = jest.fn(() => Promise.resolve('https://the-bucket-url/data.json'))

jest.mock('aws-sdk', () => ({
  S3: function () {
    this.putObject = mockPutObject
    this.headObject = mockHeadObject
    this.getSignedUrl = mockGetSignedUrl
  }
}))

jest.mock('../../../src/config', () => ({
  s3: {
    detaExport: {
      bucketName: 'the-bucket',
      signedUrlExpirationSeconds: 10
    }
  }
}))

const makeSut = () => {
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  return {
    sut: makeRequester(),
    companyIdMock
  }
}

describe('Bucket Adapter', () => {
  describe('storeCompanyData method', () => {
    it('Should call s3.putObject successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      await sut.storeCompanyData(companyIdMock, {})
      expect(mockPutObject).toHaveBeenCalledWith({
        Bucket: 'the-bucket',
        Key: `${companyIdMock}.json`,
        Body: Buffer.from(JSON.stringify({})),
        ContentType: 'application/json'
      })
    })

    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.storeCompanyData(companyIdMock, {})
      expect(result).toBe(true)
    })
  })

  describe('getCompanyDataSignedUrl method', () => {
    it('Should call s3.headObject successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      await sut.getCompanyDataSignedUrl(companyIdMock)
      expect(mockHeadObject).toHaveBeenCalledWith({
        Bucket: 'the-bucket',
        Key: `${companyIdMock}.json`
      })
    })

    it('Should call s3.getSignedUrl successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      await sut.getCompanyDataSignedUrl(companyIdMock)
      expect(mockGetSignedUrl).toHaveBeenCalledWith('getObject', {
        Bucket: 'the-bucket',
        Key: `${companyIdMock}.json`,
        Expires: 10
      })
    })

    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.getCompanyDataSignedUrl(companyIdMock)
      expect(result).toBe('https://the-bucket-url/data.json')
    })

    it('Should throw a generic Error', async () => {
      const { sut, companyIdMock } = makeSut()
      mockHeadObject.mockImplementationOnce(() => ({ promise: () => Promise.reject(new Error('generic error')) }))
      try {
        await sut.getCompanyDataSignedUrl(companyIdMock)
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('generic error')
      }
    })

    it('Should throw a NotFoundError', async () => {
      const { sut } = makeSut()
      const companyIdMock = '00000000000000'
      mockHeadObject.mockImplementationOnce(() => ({ promise: () => { const error = new Error(); error.statusCode = 404; throw error } }))
      try {
        await sut.getCompanyDataSignedUrl(companyIdMock)
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError)
        expect(error.statusCode).toBe(404)
        expect(error.message).toBe(`Company ${companyIdMock} not found`)
      }
    })
  })
})
