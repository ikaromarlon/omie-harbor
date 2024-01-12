const makeService = require('../../../../src/functions/ingestionDispatcher/service')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockCompanyRepository = {
    find: jest.fn(async () => Promise.resolve(mockSavedOmieCompanies))
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const mockQueuer = {
    sendCompanyToIngestionQueue: jest.fn(async () => Promise.resolve('https://the-queuer-url/data.json'))
  }

  const service = makeService({
    companiesRepository: mockCompanyRepository,
    queuer: mockQueuer,
    logger: mockLogger
  })

  return {
    sut: service,
    mockCompanyRepository,
    mockLogger,
    mockQueuer
  }
}

describe('ingestionDispatcher service', () => {
  it('Should return success', async () => {
    const { sut, mockCompanyRepository, mockQueuer, mockLogger } = makeSut()
    const result = await sut()
    expect(mockCompanyRepository.find).toHaveBeenCalledWith({ isActive: true })
    expect(mockQueuer.sendCompanyToIngestionQueue).toHaveBeenCalledWith(mockSavedOmieCompanies[0].id)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })

  it('Should return success but not call queuer.sendCompanyToIngestionQueue', async () => {
    const { sut, mockQueuer, mockCompanyRepository, mockLogger } = makeSut()
    mockCompanyRepository.find.mockResolvedValueOnce([])
    const result = await sut()
    expect(mockQueuer.sendCompanyToIngestionQueue).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })
})
