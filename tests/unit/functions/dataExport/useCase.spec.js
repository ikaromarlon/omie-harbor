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
    companies: { find: jest.fn(async () => omieCompaniesSavedMock) },
    categories: { find: jest.fn(async () => omieCategoriesSavedMock) },
    departments: { find: jest.fn(async () => omieDepartmentsSavedMock) },
    projects: { find: jest.fn(async () => omieProjectsSavedMock) },
    customers: { find: jest.fn(async () => omieCustomersSavedMock) },
    productsServices: { find: jest.fn(async () => omieProductsServicesSavedMock) },
    checkingAccounts: { find: jest.fn(async () => omieCheckingAccountsSavedMock) },
    contracts: { find: jest.fn(async () => omieContractsSavedMock) },
    orders: { find: jest.fn(async () => omieOrdersSavedMock) },
    billing: { find: jest.fn(async () => omieBillingSavedMock) },
    accountsPayable: { find: jest.fn(async () => omieAccountsPayableSavedMock) },
    accountsReceivable: { find: jest.fn(async () => omieAccountsReceivableSavedMock) },
    financialMovements: { find: jest.fn(async () => omieFinancialMovementsSavedMock) }
  }

  const loggerMock = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const bucketMock = {
    storeCompanyData: jest.fn(async () => Promise.resolve(null))
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
    const { sut, payloadMock, repositoriesMock, loggerMock, bucketMock, omieProductsServicesSavedMock, omieOrdersSavedMock, omieBillingSavedMock } = makeSut()
    const result = await sut({ payload: payloadMock })
    expect(repositoriesMock.companies.find).toHaveBeenCalledWith({ _id: payloadMock.companyId })
    expect(loggerMock.info).toHaveBeenCalledTimes(3)
    expect(repositoriesMock.categories.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.departments.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.projects.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.customers.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.productsServices.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.checkingAccounts.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.contracts.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.orders.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.billing.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.accountsPayable.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.accountsReceivable.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
    expect(repositoriesMock.financialMovements.find).toHaveBeenCalledWith({ companyId: payloadMock.companyId })
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
    expect(result).toEqual({ success: true })
  })
})
