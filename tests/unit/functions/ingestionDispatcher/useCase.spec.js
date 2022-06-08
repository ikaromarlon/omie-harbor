const makeUseCase = require('../../../../src/functions/ingestionDispatcher/useCase')
const { omieCompaniesSavedMock } = require('../../../mocks')

const makeSut = () => {
  const repositoriesMock = {
    companies: { find: jest.fn(async () => Promise.resolve(omieCompaniesSavedMock)) }
  }

  const loggerMock = {
    info: jest.fn(() => null)
  }

  const queuerMock = {
    sendCompanyToIngestionQueue: jest.fn(async () => Promise.resolve('https://the-queuer-url/data.json'))
  }

  const useCase = makeUseCase({
    repositories: repositoriesMock,
    queuer: queuerMock,
    logger: loggerMock
  })

  return {
    sut: useCase,
    repositoriesMock,
    loggerMock,
    queuerMock
  }
}

describe('ingestionDispatcher UseCase', () => {
  it('Should return success', async () => {
    const { sut, repositoriesMock, queuerMock, loggerMock } = makeSut()
    const result = await sut()
    expect(repositoriesMock.companies.find).toHaveBeenCalledWith({ isActive: true })
    expect(queuerMock.sendCompanyToIngestionQueue).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
    expect(loggerMock.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })

  it('Should return success but not call queuer.sendCompanyToIngestionQueue', async () => {
    const { sut, queuerMock, repositoriesMock, loggerMock } = makeSut()
    repositoriesMock.companies.find.mockResolvedValueOnce([])
    const result = await sut()
    expect(queuerMock.sendCompanyToIngestionQueue).toHaveBeenCalledTimes(0)
    expect(loggerMock.info).toHaveBeenCalledTimes(1)
    expect(result).toEqual({ success: true })
  })
})
