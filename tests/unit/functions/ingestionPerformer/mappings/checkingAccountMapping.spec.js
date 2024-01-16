const checkingAccountMapping = require('../../../../../src/functions/ingestionPerformer/mappings/checkingAccountMapping')
const {
  mockOmieCheckingAccountsResponse,
  mockCheckingAccount,
  mockOmieBanksResponse,
  mockOmieCheckingAccountTypesResponse
} = require('../../../../mocks')

delete mockCheckingAccount.id
delete mockCheckingAccount.createdAt
delete mockCheckingAccount.updatedAt

const makeSut = () => {
  const mockOmieCheckingAccount = mockOmieCheckingAccountsResponse.ListarContasCorrentes[0]
  const mockOmieBanks = mockOmieBanksResponse.fin_banco_cadastro
  const mockOmieCheckingAccountTypes = mockOmieCheckingAccountTypesResponse.cadastros
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: checkingAccountMapping,
    mockOmieCheckingAccount,
    mockOmieBanks,
    mockOmieCheckingAccountTypes,
    mockCompanyId
  }
}

describe('CheckingAccount Mapping', () => {
  it('Should return mapped checkingAccount successfully', () => {
    const { sut, mockOmieCheckingAccount, mockOmieBanks, mockOmieCheckingAccountTypes, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCheckingAccount: mockOmieCheckingAccount,
      omieBanks: mockOmieBanks,
      omieCheckingAccountTypes: mockOmieCheckingAccountTypes
    })
    expect(result).toEqual(mockCheckingAccount)
  })

  it('Should return mapped checkingAccount without bank', () => {
    const { sut, mockOmieCheckingAccount, mockOmieBanks, mockOmieCheckingAccountTypes, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCheckingAccount: { ...mockOmieCheckingAccount, codigo_banco: null },
      omieBanks: mockOmieBanks,
      omieCheckingAccountTypes: mockOmieCheckingAccountTypes
    })
    expect(result).toEqual({ ...mockCheckingAccount, bank: { code: null, name: null } })
  })

  it('Should return mapped checkingAccount without checkingAccountType', () => {
    const { sut, mockOmieCheckingAccount, mockOmieBanks, mockOmieCheckingAccountTypes, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCheckingAccount: { ...mockOmieCheckingAccount, tipo: null },
      omieBanks: mockOmieBanks,
      omieCheckingAccountTypes: mockOmieCheckingAccountTypes
    })
    expect(result).toEqual({ ...mockCheckingAccount, type: { code: null, description: null } })
  })

  it('Should return mapped checkingAccount without branch', () => {
    const { sut, mockOmieCheckingAccount, mockOmieBanks, mockOmieCheckingAccountTypes, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCheckingAccount: { ...mockOmieCheckingAccount, codigo_agencia: null },
      omieBanks: mockOmieBanks,
      omieCheckingAccountTypes: mockOmieCheckingAccountTypes
    })
    expect(result).toEqual({ ...mockCheckingAccount, branch: null })
  })

  it('Should return mapped checkingAccount without number', () => {
    const { sut, mockOmieCheckingAccount, mockOmieBanks, mockOmieCheckingAccountTypes, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCheckingAccount: { ...mockOmieCheckingAccount, numero_conta_corrente: null },
      omieBanks: mockOmieBanks,
      omieCheckingAccountTypes: mockOmieCheckingAccountTypes
    })
    expect(result).toEqual({ ...mockCheckingAccount, accountNumber: null })
  })

  it('Should return mapped checkingAccount without initialBalance', () => {
    const { sut, mockOmieCheckingAccount, mockOmieBanks, mockOmieCheckingAccountTypes, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCheckingAccount: { ...mockOmieCheckingAccount, saldo_inicial: null, saldo_data: null },
      omieBanks: mockOmieBanks,
      omieCheckingAccountTypes: mockOmieCheckingAccountTypes
    })
    expect(result).toEqual({ ...mockCheckingAccount, initialBalance: null, initialBalanceDate: null })
  })
})
