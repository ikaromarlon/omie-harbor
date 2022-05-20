const makeRequester = require('../../../src/adapters/queuer')

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
  const startDateMock = '2022-01-01T00:00:00.000'
  const endDateMock = '2022-01-03T23:59:59.999'

  return {
    sut: makeRequester(),
    companyIdMock,
    startDateMock,
    endDateMock
  }
}

describe('Queuer Adapter', () => {
  describe('sendCompanyToIngestionQueue method', () => {
    it('Should call sqs.sendMessage successfully', async () => {
      const { sut, companyIdMock, startDateMock, endDateMock } = makeSut()
      await sut.sendCompanyToIngestionQueue({ companyId: companyIdMock, startDate: startDateMock, endDate: endDateMock })
      expect(mockSendMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-ingestionQueueUrl',
        MessageGroupId: companyIdMock,
        MessageBody: JSON.stringify({ companyId: companyIdMock, startDate: startDateMock, endDate: endDateMock })
      })
    })

    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.sendCompanyToIngestionQueue({ companyId: companyIdMock, startDate: '2022-01-01T00:00:00.000', endDate: '2022-01-03T23:59:59.999' })
      expect(result).toBe(true)
    })
  })

  describe('receiveCompanyFromIngestionQueue method', () => {
    it('Should call sqs.receiveMessage successfully', async () => {
      const { sut } = makeSut()
      await sut.receiveCompanyFromIngestionQueue()
      expect(mockReceiveMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-ingestionQueueUrl',
        MaxNumberOfMessages: 1
      })
    })

    it('Should execute successfully', async () => {
      const { sut } = makeSut()
      const result = await sut.receiveCompanyFromIngestionQueue()
      expect(result).toBe(true)
    })
  })

  describe('sendCompanyToDataExportQueue method', () => {
    it('Should call sqs.sendMessage successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      await sut.sendCompanyToDataExportQueue(companyIdMock)
      expect(mockSendMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-dataExportQueueUrl',
        MessageGroupId: companyIdMock,
        MessageBody: JSON.stringify({ companyId: companyIdMock })
      })
    })

    it('Should execute successfully', async () => {
      const { sut, companyIdMock } = makeSut()
      const result = await sut.sendCompanyToDataExportQueue(companyIdMock)
      expect(result).toBe(true)
    })
  })

  describe('receiveCompanyFromExportQueue method', () => {
    it('Should call sqs.receiveMessage successfully', async () => {
      const { sut } = makeSut()
      await sut.receiveCompanyFromExportQueue()
      expect(mockReceiveMessage).toHaveBeenCalledWith({
        QueueUrl: 'https://the-dataExportQueueUrl',
        MaxNumberOfMessages: 1
      })
    })

    it('Should execute successfully', async () => {
      const { sut } = makeSut()
      const result = await sut.receiveCompanyFromExportQueue()
      expect(result).toBe(true)
    })
  })
})
