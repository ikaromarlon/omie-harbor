const { NotFoundException } = require('../../../../src/common/errors')
const makeService = require('../../../../src/functions/deleteDataByCompany/service')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockPayload = { id: '25c176b6-b200-4575-9217-e23c6105163c' }

  const mockCompaniesRepository = {
    findById: jest.fn(async () => mockSavedOmieCompanies[0])
  }

  const mockRepositories = {
    categories: {
      name: 'categories',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    departments: {
      name: 'departments',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    projects: {
      name: 'projects',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    customers: {
      name: 'customers',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    productsServices: {
      name: 'productsServices',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    checkingAccounts: {
      name: 'checkingAccounts',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    contracts: {
      name: 'contracts',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    orders: {
      name: 'orders',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    billing: {
      name: 'billing',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    accountsPayable: {
      name: 'accountsPayable',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    accountsReceivable: {
      name: 'accountsReceivable',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    financialMovements: {
      name: 'financialMovements',
      allowDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    }
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const mockSQS = {
    sendCompanyToDataExportQueue: jest.fn(async () => null)
  }

  const service = makeService({
    companiesRepository: mockCompaniesRepository,
    repositories: mockRepositories,
    sqs: mockSQS,
    logger: mockLogger
  })

  return {
    sut: service,
    mockPayload,
    mockCompaniesRepository,
    mockRepositories,
    mockLogger,
    mockSQS
  }
}

describe('deleteDataByCompany service', () => {
  it('Should delete data by company successfully', async () => {
    const { sut, mockPayload, mockCompaniesRepository, mockRepositories, mockLogger, mockSQS } = makeSut()
    const result = await sut(mockPayload)
    const { id } = mockPayload
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(id)
    expect(mockRepositories.categories.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.departments.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.projects.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.customers.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.productsServices.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.checkingAccounts.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.billing.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({ companyId: id })
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(id)
    expect(result).toEqual({
      company: {
        id: mockSavedOmieCompanies[0].id,
        cnpj: mockSavedOmieCompanies[0].cnpj,
        name: mockSavedOmieCompanies[0].name
      },
      deletedRecords: {
        categories: 0,
        departments: 0,
        projects: 0,
        customers: 0,
        productsServices: 0,
        checkingAccounts: 0,
        contracts: 0,
        orders: 0,
        billing: 0,
        accountsPayable: 0,
        accountsReceivable: 0,
        financialMovements: 0
      }
    })
  })

  it('Should throw a NotFoundException due to not find company', async () => {
    const { sut, mockPayload, mockCompaniesRepository, mockRepositories, mockLogger, mockSQS } = makeSut()
    mockPayload.id = 'any-invalid-company-id'
    mockCompaniesRepository.findById.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
    } catch (error) {
      const { id } = mockPayload
      expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(id)
      expect(mockRepositories.categories.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.departments.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.projects.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.customers.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.productsServices.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.checkingAccounts.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.billing.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe('Company not found')
    }
  })
})
