const { UnprocessableEntityException } = require('../../../../src/common/errors')
const makeService = require('../../../../src/functions/ingestionDispatcher/service')
const { mockCompany } = require('../../../mocks')

const makeSut = () => {
  const payload = {
    isActive: true
  }

  const mockCompanyRepository = {
    find: jest.fn(async () => Promise.resolve([mockCompany]))
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const mockSQS = {
    sendCompanyToIngestionQueue: jest.fn(async () => Promise.resolve('https://the-sqs-url/data.json'))
  }

  const service = makeService({
    companiesRepository: mockCompanyRepository,
    sqs: mockSQS,
    logger: mockLogger
  })

  return {
    sut: service,
    mockCompanyRepository,
    mockLogger,
    mockSQS,
    payload
  }
}

describe('ingestionDispatcher - service', () => {
  it('Should not find companies and do not send to ingestion', async () => {
    const { sut, mockSQS, mockCompanyRepository, mockLogger } = makeSut()
    const payload = { companyId: ['non-existing-company-id'] }
    mockCompanyRepository.find.mockResolvedValueOnce([])
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.message).toBe('Invalid companies')
      expect(error.data).toEqual({ invalidCompanies: { 'non-existing-company-id': 'not found' } })
    }
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({ id: ['non-existing-company-id'] })
    expect(mockSQS.sendCompanyToIngestionQueue).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
  })

  it('Should find inactive companies and do not send to ingestion', async () => {
    const { sut, mockSQS, mockCompanyRepository, mockLogger } = makeSut()
    const payload = { companyId: ['25c176b6-b200-4575-9217-e23c6105163c'] }
    mockCompanyRepository.find.mockResolvedValueOnce([{ ...mockCompany, isActive: false }])
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.message).toBe('Invalid companies')
      expect(error.data).toEqual({ invalidCompanies: { '25c176b6-b200-4575-9217-e23c6105163c': 'is not active' } })
    }
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({ id: ['25c176b6-b200-4575-9217-e23c6105163c'] })
    expect(mockSQS.sendCompanyToIngestionQueue).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
  })

  it('Should return success with companies filter', async () => {
    const { sut, mockSQS, mockCompanyRepository, mockLogger } = makeSut()
    const payload = { companyId: ['25c176b6-b200-4575-9217-e23c6105163c'] }
    const result = await sut(payload)
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({ id: ['25c176b6-b200-4575-9217-e23c6105163c'] })
    expect(mockSQS.sendCompanyToIngestionQueue).toHaveBeenCalledWith(mockCompany.id)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })

  it('Should return success with isActive filter', async () => {
    const { sut, mockCompanyRepository, mockSQS, mockLogger, payload } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.find).toHaveBeenCalledWith(payload)
    expect(mockSQS.sendCompanyToIngestionQueue).toHaveBeenCalledWith(mockCompany.id)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })
})
