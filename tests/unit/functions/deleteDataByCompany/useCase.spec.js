const makeUseCase = require('../../../../src/functions/deleteDataByCompany/useCase')
// const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockPayload = { companyId: '25c176b6-b200-4575-9217-e23c6105163c' }

  const mockRepositories = {
    categories: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    departments: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    projects: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    customers: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    productsServices: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    checkingAccounts: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    contracts: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    orders: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    billing: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    accountsPayable: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    accountsReceivable: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) },
    financialMovements: { allowsDeleteAllData: true, deleteMany: jest.fn(async () => null) }
  }

  const useCase = makeUseCase({
    repositories: mockRepositories
  })

  return {
    sut: useCase,
    mockPayload,
    mockRepositories
  }
}

describe('deleteDataByCompany UseCase', () => {
  it('Should call repositories.companies.deleteMany successfully', async () => {
    const { sut, mockPayload, mockRepositories } = makeSut()
    const result = await sut({ payload: mockPayload })
    const { companyId } = mockPayload
    // expect(mockRepositories.companies.find).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.categories.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.departments.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.projects.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.customers.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.productsServices.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.checkingAccounts.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.billing.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(result).toEqual({ success: true })
  })
})
