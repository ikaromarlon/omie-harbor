const { NotFoundError } = require('../../../../src/common/errors')
const makeUseCase = require('../../../../src/v1/deleteDataByCompany/useCase')
const { mockSavedOmieCompanies } = require('../../../mocks')

const makeSut = () => {
  const mockPayload = { id: '25c176b6-b200-4575-9217-e23c6105163c' }

  const mockRepositories = {
    companies: {
      name: 'companies',
      findOne: jest.fn(async () => mockSavedOmieCompanies[0])
    },
    categories: {
      name: 'categories',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    departments: {
      name: 'departments',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    projects: {
      name: 'projects',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    customers: {
      name: 'customers',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    productsServices: {
      name: 'productsServices',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    checkingAccounts: {
      name: 'checkingAccounts',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    contracts: {
      name: 'contracts',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    orders: {
      name: 'orders',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    billing: {
      name: 'billing',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    accountsPayable: {
      name: 'accountsPayable',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    accountsReceivable: {
      name: 'accountsReceivable',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    },
    financialMovements: {
      name: 'financialMovements',
      allowsDeleteAllData: true,
      deleteMany: jest.fn(async () => 0)
    }
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
  it('Should delete data by company successfully', async () => {
    const { sut, mockPayload, mockRepositories } = makeSut()
    const result = await sut({ payload: mockPayload })
    const { id } = mockPayload
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ _id: id })
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
    expect(result).toEqual({
      success: true,
      company: {
        id: mockSavedOmieCompanies[0]._id,
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

  it('Should throw a NotFoundError due to not find company', async () => {
    const { sut, mockPayload, mockRepositories } = makeSut()
    mockPayload.id = 'any-invalid-company-id'
    mockRepositories.companies.findOne.mockResolvedValueOnce(null)
    try {
      await sut({ payload: mockPayload })
    } catch (error) {
      const { id } = mockPayload
      expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ _id: id })
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
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error.message).toBe('Company not found')
    }
  })
})
