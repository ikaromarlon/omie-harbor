const makeService = require('../../../../src/functions/ingestionDispatcher/service')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockCompanyRepository = {
    find: jest.fn(async () => Promise.resolve(mockSavedOmieCompanies))
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
    mockSQS
  }
}

describe('ingestionDispatcher service', () => {
  it('Should return success', async () => {
    const { sut, mockCompanyRepository, mockSQS, mockLogger } = makeSut()
    const result = await sut()
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({ isActive: true })
    expect(mockSQS.sendCompanyToIngestionQueue).toHaveBeenCalledWith(mockSavedOmieCompanies[0].id)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })

  it('Should return success but not call sqs.sendCompanyToIngestionQueue', async () => {
    const { sut, mockSQS, mockCompanyRepository, mockLogger } = makeSut()
    mockCompanyRepository.find.mockResolvedValueOnce([])
    const result = await sut()
    expect(mockSQS.sendCompanyToIngestionQueue).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })
})
