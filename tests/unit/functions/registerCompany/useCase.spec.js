const makeUseCase = require('../../../../src/functions/registerCompany/useCase')
const { NotFoundException } = require('../../../../src/common/errors')
const { mockOmieCompaniesResponse, mockOmieCnaeResponse, mockParsedOmieCompany, mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const omieServiceStub = {
    getCompany: jest.fn(async () => mockOmieCompaniesResponse.empresas_cadastro[0]),
    getCnae: jest.fn(async () => mockOmieCnaeResponse.cadastros)
  }
  const companyMappingStub = jest.fn(() => mockParsedOmieCompany)
  const companiesRepositoryStub = {
    findOne: jest.fn(async () => null),
    createOrUpdateOne: jest.fn(async () => mockSavedOmieCompanies[0])
  }

  const useCase = makeUseCase({
    omieService: omieServiceStub,
    companyMapping: companyMappingStub,
    companiesRepository: companiesRepositoryStub
  })

  const mockUserId = '5429ae58-b264-4f3b-ba63-3dd304b272a1'
  const mockPayload = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const mockCredentials = { appKey: mockPayload.appKey, appSecret: mockPayload.appSecret }

  return {
    sut: useCase,
    mockUserId,
    mockPayload,
    mockCredentials,
    omieServiceStub,
    companyMappingStub,
    companiesRepositoryStub
  }
}

describe('registerCompany UseCase', () => {
  it('Should return error if company not found at Omie', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockUserId, mockCredentials, omieServiceStub, companyMappingStub, companiesRepositoryStub } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    omieServiceStub.getCompany.mockResolvedValueOnce(null)
    try {
      await sut({ userId: mockUserId, payload: mockPayload })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found in Omie service. Check the AppKey and AppSecret and try again.')
    }
    expect(companiesRepositoryStub.findOne).toHaveBeenCalledWith({ credentials: mockCredentials })
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledTimes(0)
    expect(companyMappingStub).toHaveBeenCalledTimes(0)
    expect(companiesRepositoryStub.createOrUpdateOne).toHaveBeenCalledTimes(0)
    expect(spySut).toReturnTimes(0)
  })

  it('Should return recorded company if already axists', async () => {
    const { sut, mockPayload, mockUserId, mockCredentials, omieServiceStub, companyMappingStub, companiesRepositoryStub } = makeSut()
    companiesRepositoryStub.findOne.mockResolvedValueOnce(mockSavedOmieCompanies[0])
    const result = await sut({ userId: mockUserId, payload: mockPayload })
    expect(companiesRepositoryStub.findOne).toHaveBeenCalledWith({ credentials: mockCredentials })
    expect(omieServiceStub.getCnae).toHaveBeenCalledTimes(0)
    expect(companyMappingStub).toHaveBeenCalledTimes(0)
    expect(companiesRepositoryStub.createOrUpdateOne).toHaveBeenCalledTimes(0)
    expect(result).toEqual(mockSavedOmieCompanies[0])
  })

  it('Should register Omie company successfully', async () => {
    const { sut, mockPayload, mockUserId, mockCredentials, omieServiceStub, companyMappingStub, companiesRepositoryStub } = makeSut()
    const result = await sut({ userId: mockUserId, payload: mockPayload })
    expect(companiesRepositoryStub.findOne).toHaveBeenCalledWith({ credentials: mockCredentials })
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledWith(mockCredentials)
    expect(companyMappingStub).toHaveBeenCalledWith({ omieCompany: mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
    expect(companiesRepositoryStub.createOrUpdateOne).toHaveBeenCalledWith({ credentials: mockCredentials }, {
      ...mockParsedOmieCompany
    })
    expect(result).toEqual(mockSavedOmieCompanies[0])
  })
})
