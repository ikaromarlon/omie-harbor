const makeUseCase = require('../../../../src/functions/ingestionDispatcher/useCase')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockRepositories = {
    companies: { find: jest.fn(async () => Promise.resolve(mockSavedOmieCompanies)) }
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const mockQueuer = {
    sendCompanyToIngestionQueue: jest.fn(async () => Promise.resolve('https://the-queuer-url/data.json'))
  }

  const useCase = makeUseCase({
    repositories: mockRepositories,
    queuer: mockQueuer,
    logger: mockLogger
  })

  return {
    sut: useCase,
    mockRepositories,
    mockLogger,
    mockQueuer
  }
}

describe('ingestionDispatcher UseCase', () => {
  it('Should return success', async () => {
    const { sut, mockRepositories, mockQueuer, mockLogger } = makeSut()
    const result = await sut()
    expect(mockRepositories.companies.find).toHaveBeenCalledWith({ isActive: true })
    expect(mockQueuer.sendCompanyToIngestionQueue).toHaveBeenCalledWith(mockSavedOmieCompanies[0]._id)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })

  it('Should return success but not call queuer.sendCompanyToIngestionQueue', async () => {
    const { sut, mockQueuer, mockRepositories, mockLogger } = makeSut()
    mockRepositories.companies.find.mockResolvedValueOnce([])
    const result = await sut()
    expect(mockQueuer.sendCompanyToIngestionQueue).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })
})
