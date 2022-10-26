const makeRequester = require('../../../src/utils/bucket')

const mockPutObject = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))

jest.mock('aws-sdk', () => ({
  S3: function () {
    this.putObject = mockPutObject
  }
}))

jest.mock('../../../src/config', () => ({
  S3: {
    detaExport: {
      bucketName: 'the-bucket'
    }
  }
}))

const makeSut = () => {
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  return {
    sut: makeRequester(),
    mockCompanyId
  }
}

describe('Bucket Adapter', () => {
  describe('storeCompanyData method', () => {
    it('Should execute successfully', async () => {
      const { sut, mockCompanyId } = makeSut()
      const result = await sut.storeCompanyData(mockCompanyId, {})
      expect(mockPutObject).toHaveBeenCalledWith({
        Bucket: 'the-bucket',
        Key: `${mockCompanyId}.json`,
        Body: Buffer.from(JSON.stringify({})),
        ContentType: 'application/json'
      })
      expect(result).toBe(true)
    })
  })
})
