const makeService = require('../../../../src/functions/registerCompany/service')
const { NotFoundException } = require('../../../../src/common/errors')
const { mockOmieCompaniesResponse, mockOmieCnaeResponse, mockParsedOmieCompany, mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const omieServiceStub = {
    getCompany: jest.fn(async () => mockOmieCompaniesResponse.empresas_cadastro[0]),
    getCnae: jest.fn(async () => mockOmieCnaeResponse.cadastros)
  }
  const companyMappingStub = jest.fn(() => mockParsedOmieCompany)

  const mockRepositories = {
    companies: {
      findOne: jest.fn(async () => null),
      createOrUpdateOne: jest.fn(async () => mockSavedOmieCompanies[0])
    }
  }

  const service = makeService({
    omieService: omieServiceStub,
    companyMapping: companyMappingStub,
    Repositories: () => mockRepositories
  })

  const mockPayload = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const mockCredentials = { appKey: mockPayload.appKey, appSecret: mockPayload.appSecret }

  return {
    sut: service,
    mockPayload,
    mockCredentials,
    omieServiceStub,
    companyMappingStub,
    mockRepositories
  }
}

describe('registerCompany service', () => {
  it('Should return error if company not found at Omie', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockCredentials, omieServiceStub, companyMappingStub, mockRepositories } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    omieServiceStub.getCompany.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found in Omie service. Check the AppKey and AppSecret and try again.')
    }
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ credentials: mockCredentials })
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledTimes(0)
    expect(companyMappingStub).toHaveBeenCalledTimes(0)
    expect(mockRepositories.companies.createOrUpdateOne).toHaveBeenCalledTimes(0)
    expect(spySut).toReturnTimes(0)
  })

  it('Should return recorded company if already axists', async () => {
    const { sut, mockPayload, mockCredentials, omieServiceStub, companyMappingStub, mockRepositories } = makeSut()
    mockRepositories.companies.findOne.mockResolvedValueOnce(mockSavedOmieCompanies[0])
    const result = await sut(mockPayload)
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ credentials: mockCredentials })
    expect(omieServiceStub.getCnae).toHaveBeenCalledTimes(0)
    expect(companyMappingStub).toHaveBeenCalledTimes(0)
    expect(mockRepositories.companies.createOrUpdateOne).toHaveBeenCalledTimes(0)
    expect(result).toEqual(mockSavedOmieCompanies[0])
  })

  it('Should register Omie company successfully', async () => {
    const { sut, mockPayload, mockCredentials, omieServiceStub, companyMappingStub, mockRepositories } = makeSut()
    const result = await sut(mockPayload)
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ credentials: mockCredentials })
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledWith(mockCredentials)
    expect(companyMappingStub).toHaveBeenCalledWith({ omieCompany: mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
    expect(mockRepositories.companies.createOrUpdateOne).toHaveBeenCalledWith({ credentials: mockCredentials }, {
      ...mockParsedOmieCompany
    })
    expect(result).toEqual(mockSavedOmieCompanies[0])
  })
})
