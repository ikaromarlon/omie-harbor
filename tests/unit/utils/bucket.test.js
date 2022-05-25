const makeRequester = require('../../../src/utils/bucket')

const mockPutObject = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))

jest.mock('aws-sdk', () => ({
  S3: function () {
    this.putObject = mockPutObject
  }
}))

jest.mock('../../../src/config', () => ({
  s3: {
    detaExport: {
      bucketName: 'the-bucket'
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
    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.storeCompanyData(companyIdMock, {})
      expect(mockPutObject).toHaveBeenCalledWith({
        Bucket: 'the-bucket',
        Key: `${companyIdMock}.json`,
        Body: Buffer.from(JSON.stringify({})),
        ContentType: 'application/json'
      })
      expect(result).toBe(true)
    })
  })
})
