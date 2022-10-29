const makeUseCase = require('../../../../src/v1/dataExport/useCase')
const {
  mockSavedOmieCompanies,
  mockSavedOmieCategories,
  mockSavedOmieDepartments,
  mockSavedOmieProjects,
  mockSavedOmieCustomers,
  mockSavedOmieProducts,
  mockSavedOmieServices,
  mockSavedOmieCheckingAccounts,
  mockSavedOmieContracts,
  mockSavedOmieProductOrders,
  mockSavedOmieServiceOrders,
  mockSavedOmieProductInvoices,
  mockSavedOmieServiceInvoices,
  mockSavedOmieAccountsPayable,
  mockSavedOmieAccountsReceivable,
  mockSavedOmieFinancialMovements
} = require('../../../mocks')

const makeSut = () => {
  const mockPayload = { companyId: '25c176b6-b200-4575-9217-e23c6105163c' }
  const mockSavedOmieProductsServices = [...mockSavedOmieProducts, ...mockSavedOmieServices]
  const mockSavedOmieOrders = [...mockSavedOmieProductOrders, ...mockSavedOmieServiceOrders]
  const mockSavedOmieBillingSaved = [...mockSavedOmieProductInvoices, ...mockSavedOmieServiceInvoices]

  const mockRepositories = {
    companies: { find: jest.fn(async () => mockSavedOmieCompanies) },
    categories: { find: jest.fn(async () => mockSavedOmieCategories) },
    departments: { find: jest.fn(async () => mockSavedOmieDepartments) },
    projects: { find: jest.fn(async () => mockSavedOmieProjects) },
    customers: { find: jest.fn(async () => mockSavedOmieCustomers) },
    productsServices: { find: jest.fn(async () => mockSavedOmieProductsServices) },
    checkingAccounts: { find: jest.fn(async () => mockSavedOmieCheckingAccounts) },
    contracts: { find: jest.fn(async () => mockSavedOmieContracts) },
    orders: { find: jest.fn(async () => mockSavedOmieOrders) },
    billing: { find: jest.fn(async () => mockSavedOmieBillingSaved) },
    accountsPayable: { find: jest.fn(async () => mockSavedOmieAccountsPayable) },
    accountsReceivable: { find: jest.fn(async () => mockSavedOmieAccountsReceivable) },
    financialMovements: { find: jest.fn(async () => mockSavedOmieFinancialMovements) }
  }

  const mockLogger = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const mockBucket = {
    storeCompanyData: jest.fn(async () => Promise.resolve(null))
  }

  const useCase = makeUseCase({
    repositories: mockRepositories,
    logger: mockLogger,
    bucket: mockBucket
  })

  return {
    sut: useCase,
    mockPayload,
    mockRepositories,
    mockLogger,
    mockBucket,
    mockSavedOmieProductsServices,
    mockSavedOmieOrders,
    mockSavedOmieBillingSaved
  }
}

describe('dataExport UseCase', () => {
  it('Should call repositories.companies.find successfully', async () => {
    const { sut, mockPayload, mockRepositories, mockLogger, mockBucket, mockSavedOmieProductsServices, mockSavedOmieOrders, mockSavedOmieBillingSaved } = makeSut()
    const result = await sut({ payload: mockPayload })
    expect(mockRepositories.companies.find).toHaveBeenCalledWith({ _id: mockPayload.companyId })
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
    expect(mockRepositories.categories.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.departments.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.projects.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.customers.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.productsServices.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.checkingAccounts.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.contracts.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.orders.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.billing.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.accountsPayable.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.accountsReceivable.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockRepositories.financialMovements.find).toHaveBeenCalledWith({ companyId: mockPayload.companyId })
    expect(mockBucket.storeCompanyData).toHaveBeenCalledWith(mockPayload.companyId, {
      companies: mockSavedOmieCompanies,
      categories: mockSavedOmieCategories,
      departments: mockSavedOmieDepartments,
      projects: mockSavedOmieProjects,
      customers: mockSavedOmieCustomers,
      productsServices: mockSavedOmieProductsServices,
      checkingAccounts: mockSavedOmieCheckingAccounts,
      contracts: mockSavedOmieContracts,
      orders: mockSavedOmieOrders,
      billing: mockSavedOmieBillingSaved,
      accountsPayable: mockSavedOmieAccountsPayable,
      accountsReceivable: mockSavedOmieAccountsReceivable,
      financialMovements: mockSavedOmieFinancialMovements
    })
    expect(result).toEqual({ success: true })
  })
})
