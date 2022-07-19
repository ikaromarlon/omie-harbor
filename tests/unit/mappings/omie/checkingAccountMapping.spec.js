const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeCheckingAccountMapping = require('../../../../src/mappings/omie/checkingAccountMapping')
const {
  omieCheckingAccountsResponseMock,
  omieCheckingAccountParsedMock,
  omieBanksResponseMock,
  omieCheckingAccountTypesResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieCheckingAccountMock = omieCheckingAccountsResponseMock.ListarContasCorrentes[0]
  const omieBanksMock = omieBanksResponseMock.fin_banco_cadastro
  const omieCheckingAccountTypesMock = omieCheckingAccountTypesResponseMock.cadastros
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeCheckingAccountMapping({ providerName, helpers }),
    omieCheckingAccountMock,
    omieBanksMock,
    omieCheckingAccountTypesMock,
    companyIdMock
  }
}

describe('CheckingAccount Mapping', () => {
  it('Should return mapped checkingAccount successfully', () => {
    const { sut, omieCheckingAccountMock, omieBanksMock, omieCheckingAccountTypesMock, companyIdMock } = makeSut()
    const result = sut({ omieCheckingAccount: omieCheckingAccountMock, omieBanks: omieBanksMock, omieCheckingAccountTypes: omieCheckingAccountTypesMock, companyId: companyIdMock })
    expect(result).toEqual(omieCheckingAccountParsedMock)
  })

  it('Should return mapped checkingAccount without bank', () => {
    const { sut, omieCheckingAccountMock, omieBanksMock, omieCheckingAccountTypesMock, companyIdMock } = makeSut()
    const result = sut({ omieCheckingAccount: { ...omieCheckingAccountMock, codigo_banco: null }, omieBanks: omieBanksMock, omieCheckingAccountTypes: omieCheckingAccountTypesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCheckingAccountParsedMock, bank: { code: null, name: null } })
  })

  it('Should return mapped checkingAccount without checkingAccountType', () => {
    const { sut, omieCheckingAccountMock, omieBanksMock, omieCheckingAccountTypesMock, companyIdMock } = makeSut()
    const result = sut({ omieCheckingAccount: { ...omieCheckingAccountMock, tipo: null }, omieBanks: omieBanksMock, omieCheckingAccountTypes: omieCheckingAccountTypesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCheckingAccountParsedMock, type: { code: null, description: null } })
  })

  it('Should return mapped checkingAccount without branch', () => {
    const { sut, omieCheckingAccountMock, omieBanksMock, omieCheckingAccountTypesMock, companyIdMock } = makeSut()
    const result = sut({ omieCheckingAccount: { ...omieCheckingAccountMock, codigo_agencia: null }, omieBanks: omieBanksMock, omieCheckingAccountTypes: omieCheckingAccountTypesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCheckingAccountParsedMock, branch: null })
  })

  it('Should return mapped checkingAccount without number', () => {
    const { sut, omieCheckingAccountMock, omieBanksMock, omieCheckingAccountTypesMock, companyIdMock } = makeSut()
    const result = sut({ omieCheckingAccount: { ...omieCheckingAccountMock, numero_conta_corrente: null }, omieBanks: omieBanksMock, omieCheckingAccountTypes: omieCheckingAccountTypesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCheckingAccountParsedMock, accountNumber: null })
  })

  it('Should return mapped checkingAccount without initialBalance', () => {
    const { sut, omieCheckingAccountMock, omieBanksMock, omieCheckingAccountTypesMock, companyIdMock } = makeSut()
    const result = sut({ omieCheckingAccount: { ...omieCheckingAccountMock, saldo_inicial: null, saldo_data: null }, omieBanks: omieBanksMock, omieCheckingAccountTypes: omieCheckingAccountTypesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCheckingAccountParsedMock, initialBalance: null, initialBalanceDate: null })
  })
})
