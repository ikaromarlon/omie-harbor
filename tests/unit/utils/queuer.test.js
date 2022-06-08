const makeRequester = require('../../../src/utils/queuer')

const mockSendMessage = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))
const mockReceiveMessage = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))

jest.mock('aws-sdk', () => ({
  SQS: function () {
    this.sendMessage = mockSendMessage
    this.receiveMessage = mockReceiveMessage
  }
}))

jest.mock('../../../src/config', () => ({
  sqs: { ingestionQueueUrl: 'https://the-ingestionQueueUrl', dataExportQueueUrl: 'https://the-dataExportQueueUrl' }
}))

const makeSut = () => {
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeRequester(),
    companyIdMock
  }
}

describe('Queuer Adapter', () => {
  describe('sendCompanyToIngestionQueue method', () => {
    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.sendCompanyToIngestionQueue(companyIdMock)
      expect(mockSendMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-ingestionQueueUrl',
        MessageGroupId: companyIdMock,
        MessageBody: JSON.stringify({ companyId: companyIdMock })
      })
      expect(result).toBe(true)
    })
  })

  describe('sendCompanyToDataExportQueue method', () => {
    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.sendCompanyToDataExportQueue(companyIdMock)
      expect(mockSendMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-dataExportQueueUrl',
        MessageGroupId: companyIdMock,
        MessageBody: JSON.stringify({ companyId: companyIdMock })
      })
      expect(result).toBe(true)
    })
  })
})
