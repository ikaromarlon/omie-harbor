const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeCompanyMapping = require('../../../../src/mappings/omie/companyMapping')
const { mockOmieCompaniesResponse, mockParsedOmieCompany, mockOmieCnaeResponse } = require('../../../mocks')

const makeSut = () => {
  const mockOmieCompany = mockOmieCompaniesResponse.empresas_cadastro[0]
  const mockCredentials = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const mockOmieCnae = mockOmieCnaeResponse.cadastros

  return {
    sut: makeCompanyMapping({ providerName }),
    mockOmieCompany,
    mockCredentials,
    mockOmieCnae
  }
}

describe('Company Mapping', () => {
  it('Should return mapped company successfully', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({ omieCompany: mockOmieCompany, omieCnae: mockOmieCnae, credentials: mockCredentials })
    expect(result).toEqual(mockParsedOmieCompany)
  })

  it('Should return mapped without first phone', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({ omieCompany: { ...mockOmieCompany, telefone1_ddd: '', telefone1_numero: '' }, omieCnae: mockOmieCnae, credentials: mockCredentials })
    expect(result).toEqual({ ...mockParsedOmieCompany, phones: [{ ...mockParsedOmieCompany.phones[1] }] })
  })

  it('Should return mapped without second phone', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({ omieCompany: { ...mockOmieCompany, telefone2_ddd: '', telefone2_numero: '' }, omieCnae: mockOmieCnae, credentials: mockCredentials })
    expect(result).toEqual({ ...mockParsedOmieCompany, phones: [{ ...mockParsedOmieCompany.phones[0] }] })
  })

  it('Should return mapped company without cnae', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({ omieCompany: { ...mockOmieCompany, cnae: null }, omieCnae: mockOmieCnae, credentials: mockCredentials })
    expect(result).toEqual({ ...mockParsedOmieCompany, cnae: null })
  })
})
