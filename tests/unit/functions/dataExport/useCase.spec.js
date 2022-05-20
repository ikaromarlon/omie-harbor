const makeUseCase = require('../../../../src/functions/dataExport/useCase')
const {
  omieCompaniesSavedMock,
  omieCategoriesSavedMock,
  omieDepartmentsSavedMock,
  omieProjectsSavedMock,
  omieCustomersSavedMock,
  omieProductsSavedMock,
  omieServicesSavedMock,
  omieCheckingAccountsSavedMock,
  omieContractsSavedMock,
  omieProductOrdersSavedMock,
  omieServiceOrdersSavedMock,
  omieProductInvoicesSavedMock,
  omieServiceInvoicesSavedMock,
  omieAccountsPayableSavedMock,
  omieAccountsReceivableSavedMock,
  omieFinancialMovementsSavedMock
} = require('../../../mocks')

const makeSut = () => {
  const payloadMock = { companyId: '25c176b6-b200-4575-9217-e23c6105163c' }
  const omieProductsServicesSavedMock = [...omieProductsSavedMock, ...omieServicesSavedMock]
  const omieOrdersSavedMock = [...omieProductOrdersSavedMock, ...omieServiceOrdersSavedMock]
  const omieBillingSavedMock = [...omieProductInvoicesSavedMock, ...omieServiceInvoicesSavedMock]

  const repositoriesMock = {
    companies: { find: async (filter) => Promise.resolve(omieCompaniesSavedMock) },
    categories: { find: async (filter) => Promise.resolve(omieCategoriesSavedMock) },
    departments: { find: async (filter) => Promise.resolve(omieDepartmentsSavedMock) },
    projects: { find: async (filter) => Promise.resolve(omieProjectsSavedMock) },
    customers: { find: async (filter) => Promise.resolve(omieCustomersSavedMock) },
    productsServices: { find: async (filter) => Promise.resolve(omieProductsServicesSavedMock) },
    checkingAccounts: { find: async (filter) => Promise.resolve(omieCheckingAccountsSavedMock) },
    contracts: { find: async (filter) => Promise.resolve(omieContractsSavedMock) },
    orders: { find: async (filter) => Promise.resolve(omieOrdersSavedMock) },
    billing: { find: async (filter) => Promise.resolve(omieBillingSavedMock) },
    accountsPayable: { find: async (filter) => Promise.resolve(omieAccountsPayableSavedMock) },
    accountsReceivable: { find: async (filter) => Promise.resolve(omieAccountsReceivableSavedMock) },
    financialMovements: { find: async (filter) => Promise.resolve(omieFinancialMovementsSavedMock) }
  }

  const loggerMock = {
    info: jest.fn((data) => null),
    error: jest.fn((data) => null)
  }

  const bucketMock = {
    storeCompanyData: jest.fn(async (companyId, data) => Promise.resolve(null))
  }

  const useCase = makeUseCase({
    repositories: repositoriesMock,
    logger: loggerMock,
    bucket: bucketMock
  })

  return {
    sut: useCase,
    payloadMock,
    repositoriesMock,
    loggerMock,
    bucketMock,
    omieProductsServicesSavedMock,
    omieOrdersSavedMock,
    omieBillingSavedMock
  }
}

describe('dataExport UseCase', () => {
  it('Should call repositories.companies.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.companies, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ _id: payloadMock.companyId })
  })

  it('Should call logger.info successfully', async () => {
    const { sut, payloadMock, loggerMock } = makeSut()
    await sut({ payload: payloadMock })
    expect(loggerMock.info).toHaveBeenCalledTimes(3)
  })

  it('Should call repositories.categories.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.categories, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.departments.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.departments, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.projects.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.projects, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.customers.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.customers, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.productsServices.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.productsServices, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.checkingAccounts.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.checkingAccounts, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.contracts.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.contracts, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.orders.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.orders, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.billing.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.billing, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.accountsPayable.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.accountsPayable, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.accountsReceivable.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.accountsReceivable, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call repositories.financialMovements.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    const findSpy = jest.spyOn(repositoriesMock.financialMovements, 'find')
    await sut({ payload: payloadMock })
    expect(findSpy).toHaveBeenCalledWith({ companyId: omieCompaniesSavedMock[0]._id })
  })

  it('Should call bucket.storeCompanyData successfully', async () => {
    const { sut, payloadMock, bucketMock, omieProductsServicesSavedMock, omieOrdersSavedMock, omieBillingSavedMock } = makeSut()
    await sut({ payload: payloadMock })
    expect(bucketMock.storeCompanyData).toHaveBeenCalledWith(payloadMock.companyId, {
      companies: omieCompaniesSavedMock,
      categories: omieCategoriesSavedMock,
      departments: omieDepartmentsSavedMock,
      projects: omieProjectsSavedMock,
      customers: omieCustomersSavedMock,
      productsServices: omieProductsServicesSavedMock,
      checkingAccounts: omieCheckingAccountsSavedMock,
      contracts: omieContractsSavedMock,
      orders: omieOrdersSavedMock,
      billing: omieBillingSavedMock,
      accountsPayable: omieAccountsPayableSavedMock,
      accountsReceivable: omieAccountsReceivableSavedMock,
      financialMovements: omieFinancialMovementsSavedMock
    })
  })

  it('Should return success', async () => {
    const { sut, payloadMock } = makeSut()
    const result = await sut({ payload: payloadMock })
    expect(result).toEqual({ success: true })
  })
})
