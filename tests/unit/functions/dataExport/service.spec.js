const { NotFoundException } = require('../../../../src/common/errors')
const makeService = require('../../../../src/functions/dataExport/service')
const {
  mockCompany,
  mockCategory,
  mockDepartment,
  mockProject,
  mockCustomer,
  mockProduct,
  mockService,
  mockCheckingAccount,
  mockContract,
  mockProductOrder,
  mockServiceOrder,
  mockProductInvoice,
  mockServiceInvoice,
  mockAccountPayable,
  mockAccountReceivable,
  mockFinancialMovement
} = require('../../../mocks')

const makeSut = () => {
  const payload = { companyId: '25c176b6-b200-4575-9217-e23c6105163c' }
  const mockProductServices = [mockProduct, mockService]
  const mockOrders = [mockProductOrder, mockServiceOrder]
  const mockBillingSaved = [mockProductInvoice, mockServiceInvoice]

  const mockCompanyRepository = {
    findById: jest.fn(async () => mockCompany)
  }

  const mockRepositories = {
    categories: { findMany: jest.fn(async () => [mockCategory]) },
    departments: { findMany: jest.fn(async () => [mockDepartment]) },
    projects: { findMany: jest.fn(async () => [mockProject]) },
    customers: { findMany: jest.fn(async () => [mockCustomer]) },
    productsServices: { findMany: jest.fn(async () => [mockProductServices]) },
    checkingAccounts: { findMany: jest.fn(async () => [mockCheckingAccount]) },
    contracts: { findMany: jest.fn(async () => [mockContract]) },
    orders: { findMany: jest.fn(async () => [mockOrders]) },
    billing: { findMany: jest.fn(async () => [mockBillingSaved]) },
    accountsPayable: { findMany: jest.fn(async () => [mockAccountPayable]) },
    accountsReceivable: { findMany: jest.fn(async () => [mockAccountReceivable]) },
    financialMovements: { findMany: jest.fn(async () => [mockFinancialMovement]) }
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
    mockProductServices,
    mockOrders,
    mockBillingSaved
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
    const { sut, payload, mockCompanyRepository, mockRepositories, mockLogger, mockS3, mockProductServices, mockOrders, mockBillingSaved } = makeSut()
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
      company: mockCompany,
      categories: [mockCategory],
      departments: [mockDepartment],
      projects: [mockProject],
      customers: [mockCustomer],
      productsServices: [mockProductServices],
      checkingAccounts: [mockCheckingAccount],
      contracts: [mockContract],
      orders: [mockOrders],
      billing: [mockBillingSaved],
      accountsPayable: [mockAccountPayable],
      accountsReceivable: [mockAccountReceivable],
      financialMovements: [mockFinancialMovement]
    })
    expect(result).toEqual({ success: true })
  })
})
