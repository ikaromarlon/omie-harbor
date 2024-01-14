const { NotFoundException } = require('../../../../src/common/errors')
const makeService = require('../../../../src/functions/dataExport/service')
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
  const payload = { companyId: '25c176b6-b200-4575-9217-e23c6105163c' }
  const mockSavedOmieProductsServices = [...mockSavedOmieProducts, ...mockSavedOmieServices]
  const mockSavedOmieOrders = [...mockSavedOmieProductOrders, ...mockSavedOmieServiceOrders]
  const mockSavedOmieBillingSaved = [...mockSavedOmieProductInvoices, ...mockSavedOmieServiceInvoices]

  const mockCompanyRepository = {
    findById: jest.fn(async () => mockSavedOmieCompanies[0])
  }

  const mockRepositories = {
    categories: { findMany: jest.fn(async () => mockSavedOmieCategories) },
    departments: { findMany: jest.fn(async () => mockSavedOmieDepartments) },
    projects: { findMany: jest.fn(async () => mockSavedOmieProjects) },
    customers: { findMany: jest.fn(async () => mockSavedOmieCustomers) },
    productsServices: { findMany: jest.fn(async () => mockSavedOmieProductsServices) },
    checkingAccounts: { findMany: jest.fn(async () => mockSavedOmieCheckingAccounts) },
    contracts: { findMany: jest.fn(async () => mockSavedOmieContracts) },
    orders: { findMany: jest.fn(async () => mockSavedOmieOrders) },
    billing: { findMany: jest.fn(async () => mockSavedOmieBillingSaved) },
    accountsPayable: { findMany: jest.fn(async () => mockSavedOmieAccountsPayable) },
    accountsReceivable: { findMany: jest.fn(async () => mockSavedOmieAccountsReceivable) },
    financialMovements: { findMany: jest.fn(async () => mockSavedOmieFinancialMovements) }
  }

  const mockLogger = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const mockS3 = {
    storeCompanyData: jest.fn(async () => Promise.resolve(null))
  }

  const service = makeService({
    companiesRepository: mockCompanyRepository,
    repositories: mockRepositories,
    logger: mockLogger,
    s3: mockS3
  })

  return {
    sut: service,
    payload,
    mockCompanyRepository,
    mockRepositories,
    mockLogger,
    mockS3,
    mockSavedOmieProductsServices,
    mockSavedOmieOrders,
    mockSavedOmieBillingSaved
  }
}

describe('dataExport - service', () => {
  it('Should not export data to s3 successfully', async () => {
    const { sut, payload, mockCompanyRepository, mockRepositories, mockLogger, mockS3 } = makeSut()

    mockCompanyRepository.findById.mockResolvedValueOnce(null)

    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found')
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.companyId)
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockRepositories.categories.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.departments.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.projects.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.customers.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.productsServices.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.checkingAccounts.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.contracts.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.orders.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.billing.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.accountsPayable.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.accountsReceivable.findMany).toHaveBeenCalledTimes(0)
    expect(mockRepositories.financialMovements.findMany).toHaveBeenCalledTimes(0)
    expect(mockS3.storeCompanyData).toHaveBeenCalledTimes(0)
  })

  it('Should export data to s3 successfully', async () => {
    const { sut, payload, mockCompanyRepository, mockRepositories, mockLogger, mockS3, mockSavedOmieProductsServices, mockSavedOmieOrders, mockSavedOmieBillingSaved } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.companyId)
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
    expect(mockRepositories.categories.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.departments.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.projects.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.customers.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.productsServices.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.checkingAccounts.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.contracts.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.billing.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.accountsPayable.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.accountsReceivable.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockRepositories.financialMovements.findMany).toHaveBeenCalledWith({ companyId: payload.companyId })
    expect(mockS3.storeCompanyData).toHaveBeenCalledWith(payload.companyId, {
      company: mockSavedOmieCompanies[0],
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
