const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeCompanyMapping = require('../../../../src/mappings/omie/companyMapping')
const { omieCompaniesResponseMock, omieCompanyParsedMock, omieCnaeResponseMock } = require('../../../mocks')

const makeSut = () => {
  const omieCompanyMock = omieCompaniesResponseMock.empresas_cadastro[0]
  const credentialsMock = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const omieCnaeMock = omieCnaeResponseMock.cadastros

  return {
    sut: makeCompanyMapping({ providerName, helpers }),
    omieCompanyMock,
    credentialsMock,
    omieCnaeMock
  }
}

describe('Company Mapping', () => {
  it('Should return mapped company successfully', () => {
    const { sut, omieCompanyMock, credentialsMock, omieCnaeMock } = makeSut()
    const result = sut({ omieCompany: omieCompanyMock, omieCnae: omieCnaeMock, credentials: credentialsMock })
    expect(result).toEqual(omieCompanyParsedMock)
  })

  it('Should return mapped without first phone', () => {
    const { sut, omieCompanyMock, credentialsMock, omieCnaeMock } = makeSut()
    const result = sut({ omieCompany: { ...omieCompanyMock, telefone1_ddd: '', telefone1_numero: '' }, omieCnae: omieCnaeMock, credentials: credentialsMock })
    expect(result).toEqual({ ...omieCompanyParsedMock, phones: [{ ...omieCompanyParsedMock.phones[1] }] })
  })

  it('Should return mapped without second phone', () => {
    const { sut, omieCompanyMock, credentialsMock, omieCnaeMock } = makeSut()
    const result = sut({ omieCompany: { ...omieCompanyMock, telefone2_ddd: '', telefone2_numero: '' }, omieCnae: omieCnaeMock, credentials: credentialsMock })
    expect(result).toEqual({ ...omieCompanyParsedMock, phones: [{ ...omieCompanyParsedMock.phones[0] }] })
  })

  it('Should return mapped company without cnae', () => {
    const { sut, omieCompanyMock, credentialsMock, omieCnaeMock } = makeSut()
    const result = sut({ omieCompany: { ...omieCompanyMock, cnae: null }, omieCnae: omieCnaeMock, credentials: credentialsMock })
    expect(result).toEqual({ ...omieCompanyParsedMock, cnae: null })
  })
})
