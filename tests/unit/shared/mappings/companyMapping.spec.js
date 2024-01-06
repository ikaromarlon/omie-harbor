const companyMapping = require('../../../../src/shared/mappings/companyMapping')
const { mockOmieCompaniesResponse, mockParsedOmieCompany, mockOmieCnaeResponse } = require('../../../mocks')

const makeSut = () => {
  const mockOmieCompany = mockOmieCompaniesResponse.empresas_cadastro[0]
  const mockCredentials = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const mockOmieCnae = mockOmieCnaeResponse.cadastros

  return {
    sut: companyMapping,
    mockOmieCompany,
    mockCredentials,
    mockOmieCnae
  }
}

describe('Company Mapping', () => {
  it('Should return mapped company successfully', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({
      credentials: mockCredentials,
      omieCompany: mockOmieCompany,
      omieCnae: mockOmieCnae
    })
    expect(result).toEqual(mockParsedOmieCompany)
  })

  it('Should return mapped without first phone', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({
      credentials: mockCredentials,
      omieCompany: { ...mockOmieCompany, telefone1_ddd: '', telefone1_numero: '' },
      omieCnae: mockOmieCnae
    })
    expect(result).toEqual({ ...mockParsedOmieCompany, phones: [{ ...mockParsedOmieCompany.phones[1] }] })
  })

  it('Should return mapped without second phone', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({
      credentials: mockCredentials,
      omieCompany: { ...mockOmieCompany, telefone2_ddd: '', telefone2_numero: '' },
      omieCnae: mockOmieCnae
    })
    expect(result).toEqual({ ...mockParsedOmieCompany, phones: [{ ...mockParsedOmieCompany.phones[0] }] })
  })

  it('Should return mapped company without cnae', () => {
    const { sut, mockOmieCompany, mockCredentials, mockOmieCnae } = makeSut()
    const result = sut({
      credentials: mockCredentials,
      omieCompany: { ...mockOmieCompany, cnae: null },
      omieCnae: mockOmieCnae
    })
    expect(result).toEqual({ ...mockParsedOmieCompany, cnae: null })
  })
})
