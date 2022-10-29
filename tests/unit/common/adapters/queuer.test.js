const makeQueuer = require('../../../../src/common/adapters/queuer')

const mockSendMessage = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))
const mockReceiveMessage = jest.fn(() => ({ promise: () => new Promise((resolve, reject) => resolve(true)) }))

jest.mock('aws-sdk', () => ({
  SQS: function () {
    this.sendMessage = mockSendMessage
    this.receiveMessage = mockReceiveMessage
  }
}))

jest.mock('../../../../src/config', () => ({
  SQS: { ingestionQueueUrl: 'https://the-ingestionQueueUrl', dataExportQueueUrl: 'https://the-dataExportQueueUrl' },
  services: {
    omie: {
      providerName: 'Omie'
    }
  }
}))

const makeSut = () => {
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeQueuer(),
    mockCompanyId
  }
}

describe('Queuer Adapter', () => {
  describe('sendCompanyToIngestionQueue method', () => {
    it('Should execute successfully', async () => {
      const { sut, mockCompanyId } = makeSut()
      const result = await sut.sendCompanyToIngestionQueue(mockCompanyId)
      expect(mockSendMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-ingestionQueueUrl',
        MessageGroupId: 'Omie-ingestion',
        MessageBody: JSON.stringify({ companyId: mockCompanyId })
      })
      expect(result).toBe(true)
    })
  })

  describe('sendCompanyToDataExportQueue method', () => {
    it('Should execute successfully', async () => {
      const { sut, mockCompanyId } = makeSut()
      const result = await sut.sendCompanyToDataExportQueue(mockCompanyId)
      expect(mockSendMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-dataExportQueueUrl',
        MessageGroupId: 'data-export',
        MessageBody: JSON.stringify({ companyId: mockCompanyId })
      })
      expect(result).toBe(true)
    })
  })
})
