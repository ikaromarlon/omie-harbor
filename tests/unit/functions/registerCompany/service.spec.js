const makeService = require('../../../../src/functions/registerCompany/service')
const { ConflictException } = require('../../../../src/common/errors')
const { mockOmieCompaniesResponse, mockOmieCnaeResponse, mockCompany } = require('../../../mocks')

const makeSut = () => {
  const omieServiceStub = {
    getCompany: jest.fn(async () => mockOmieCompaniesResponse.empresas_cadastro[0]),
    getCnae: jest.fn(async () => mockOmieCnaeResponse.cadastros)
  }
  const companyMappingStub = jest.fn(() => mockCompany)

  const mockCompanyRepository = {
    findByCredentials: jest.fn(async () => null),
    create: jest.fn(async () => mockCompany)
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
    mockCompanyRepository.findByCredentials.mockResolvedValueOnce(mockCompany)
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

  it('Should register Omie company successfully', async () => {
    const { sut, payload, mockCredentials, omieServiceStub, companyMappingStub, mockCompanyRepository } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.findByCredentials).toHaveBeenCalledWith(mockCredentials.appKey, mockCredentials.appSecret)
    expect(omieServiceStub.getCompany).toHaveBeenCalledWith(mockCredentials, true)
    expect(omieServiceStub.getCnae).toHaveBeenCalledWith(mockCredentials)
    expect(companyMappingStub).toHaveBeenCalledWith({ omieCompany: mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
    expect(mockCompanyRepository.create).toHaveBeenCalledWith(mockCompany)
    expect(result).toEqual(mockCompany)
  })
})
