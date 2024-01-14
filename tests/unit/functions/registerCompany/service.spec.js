const makeService = require('../../../../src/functions/registerCompany/service')
const { NotFoundException, ConflictException } = require('../../../../src/common/errors')
const { mockOmieCompaniesResponse, mockOmieCnaeResponse, mockParsedOmieCompany, mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const omieServiceStub = {
    getCompany: jest.fn(async () => mockOmieCompaniesResponse.empresas_cadastro[0]),
    getCnae: jest.fn(async () => mockOmieCnaeResponse.cadastros)
  }
  const companyMappingStub = jest.fn(() => mockParsedOmieCompany)

  const mockCompanyRepository = {
    findByCredentials: jest.fn(async () => null),
    create: jest.fn(async () => mockSavedOmieCompanies[0])
  }

  const service = makeService({
    omieService: omieServiceStub,
    companyMapping: companyMappingStub,
    companiesRepository: mockCompanyRepository
  })

  const payload = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const mockCredentials = { appKey: payload.appKey, appSecret: payload.appSecret }

  return {
    sut: service,
    payload,
    mockCredentials,
    omieServiceStub,
    companyMappingStub,
    mockCompanyRepository
  }
}

describe('registerCompany - service', () => {
  it('Should return error if a company with provided credentials already exists in the database', async () => {
    const { sut, payload, mockCredentials, omieServiceStub, companyMappingStub, mockCompanyRepository } = makeSut()
    mockCompanyRepository.findByCredentials.mockResolvedValueOnce(mockSavedOmieCompanies[0])
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(ConflictException)
      expect(error.message).toBe('Company with provided credentials already exists.')
    }
    expect(mockCompanyRepository.findByCredentials).toHaveBeenCalledWith(mockCredentials.appKey, mockCredentials.appSecret)
    expect(omieServiceStub.getCnae).toHaveBeenCalledTimes(0)
    expect(companyMappingStub).toHaveBeenCalledTimes(0)
    expect(mockCompanyRepository.create).toHaveBeenCalledTimes(0)
  })

  it('Should return error if company not found at Omie', async () => {
    const sutPackage = makeSut()
    const { sut, payload, mockCredentials, omieServiceStub, companyMappingStub, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    omieServiceStub.getCompany.mockResolvedValueOnce(null)
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found at Omie. Check the AppKey and AppSecret and try again.')
    }
    expect(mockCompanyRepository.findByCredentials).toHaveBeenCalledWith(mockCredentials.appKey, mockCredentials.appSecret)
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledTimes(0)
    expect(companyMappingStub).toHaveBeenCalledTimes(0)
    expect(mockCompanyRepository.create).toHaveBeenCalledTimes(0)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should register Omie company successfully', async () => {
    const { sut, payload, mockCredentials, omieServiceStub, companyMappingStub, mockCompanyRepository } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.findByCredentials).toHaveBeenCalledWith(mockCredentials.appKey, mockCredentials.appSecret)
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledWith(mockCredentials)
    expect(companyMappingStub).toHaveBeenCalledWith({ omieCompany: mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(mockParsedOmieCompany)
    expect(result).toEqual(mockSavedOmieCompanies[0])
  })
})
