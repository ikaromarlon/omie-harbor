const makeUseCase = require('../../../../src/functions/deleteDataByCompany/useCase')
// const { omieCompaniesSavedMock } = require('../../../mocks')

const makeSut = () => {
  const payloadMock = { companyId: '25c176b6-b200-4575-9217-e23c6105163c' }

  const repositoriesMock = {
    categories: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    departments: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    projects: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    customers: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    productsServices: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    checkingAccounts: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    contracts: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    orders: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    billing: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    accountsPayable: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    accountsReceivable: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) },
    financialMovements: { allowDeleteByCompany: true, deleteMany: jest.fn(async () => null) }
  }

  const useCase = makeUseCase({
    repositories: repositoriesMock
  })

  return {
    sut: useCase,
    payloadMock,
    repositoriesMock
  }
}

describe('deleteDataByCompany UseCase', () => {
  it('Should call repositories.companies.deleteMany successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const result = await sut({ payload: payloadMock })
    const { companyId } = payloadMock
    // expect(repositoriesMock.companies.find).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.categories.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.departments.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.projects.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.customers.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.productsServices.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.checkingAccounts.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.contracts.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.orders.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.billing.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.accountsPayable.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.accountsReceivable.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(repositoriesMock.financialMovements.deleteMany).toHaveBeenCalledWith({ _id: companyId })
    expect(result).toEqual({ success: true })
  })
})
