const makeUseCase = require('../../../../src/functions/ingestionPerformer/useCase')
const mocks = require('../../../mocks')

const makeSut = () => {
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const payloadMock = { companyId: companyIdMock }
  const credentialsMock = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const productIdMock = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const serviceIdMock = 'e46a6ab1-dd50-4579-b11d-d939fd35bcf3'
  const checkingAccountIdMock = 'e5e74170-40ee-42d9-9741-6d708200e306'
  const contractIdMock = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'
  const accountPayableIdMock = '2f9671a0-1b1e-4e45-8f59-b76f10af37e1'
  const accountReceivableIdMock = '377f094b-a59b-4ca5-bad4-2ce20d636439'

  const omieServiceMock = {
    getCnae: jest.fn(async (credentials) => mocks.omieCnaeResponseMock.cadastros),
    getEntryOrigins: jest.fn(async (credentials) => mocks.omieEntryOriginsResponseMock.origem),
    getDocumentTypes: jest.fn(async (credentials) => mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro),
    getCompany: jest.fn(async (credentials) => mocks.omieCompaniesResponseMock.empresas_cadastro[0]),
    getCategories: jest.fn(async (credentials) => [mocks.omieCategoriesResponseMock.categoria_cadastro[0]]),
    getDepartments: jest.fn(async (credentials) => [mocks.omieDepartmentsResponseMock.departamentos[0]]),
    getProjects: jest.fn(async (credentials) => mocks.omieProjectsResponseMock.cadastro),
    getCustomers: jest.fn(async (credentials) => mocks.omieCustomersResponseMock.clientes_cadastro),
    getActivities: jest.fn(async (credentials) => mocks.omieActivitiesResponseMock.lista_tipos_atividade),
    getProducts: jest.fn(async (credentials) => mocks.omieProductsResponseMock.produto_servico_cadastro),
    getServices: jest.fn(async (credentials) => mocks.omieServicesResponseMock.cadastros),
    getCheckingAccounts: jest.fn(async (credentials) => mocks.omieCheckingAccountsResponseMock.ListarContasCorrentes),
    getBanks: jest.fn(async (credentials) => mocks.omieBanksResponseMock.fin_banco_cadastro),
    getCheckingAccountTypes: jest.fn(async (credentials) => mocks.omieCheckingAccountTypesResponseMock.cadastros),
    getContracts: jest.fn(async (credentials) => mocks.omieContractsResponseMock.contratoCadastro),
    getContractBillingTypes: jest.fn(async (credentials) => mocks.omieContractBillingTypesResponseMock.cadastros),
    getContractSteps: jest.fn(async (credentials) => mocks.omieContractStepsResponseMock),
    getProductOrders: jest.fn(async (credentials) => mocks.omieProductOrdersResponseMock.pedido_venda_produto),
    getServiceOrders: jest.fn(async (credentials) => mocks.omieServiceOrdersResponseMock.osCadastro),
    getBillingSteps: jest.fn(async (credentials) => mocks.omieBillingStepsResponseMock.cadastros),
    getProductInvoices: jest.fn(async (credentials) => mocks.omieProductInvoicesResponseMock.nfCadastro),
    getServiceInvoices: jest.fn(async (credentials) => mocks.omieServiceInvoicesResponseMock.nfseEncontradas),
    getAccountsPayable: jest.fn(async (credentials) => mocks.omieAccountsPayableResponseMock.titulosEncontrados),
    getAccountsReceivable: jest.fn(async (credentials) => mocks.omieAccountsReceivableResponseMock.titulosEncontrados),
    getFinancialMovements: jest.fn(async (credentials) => mocks.omieFinancialMovementsResponseMock.movimentos)
  }

  const omieMappingsMock = {
    /** dimensions */
    company: jest.fn(() => mocks.omieCompanyParsedMock),
    category: jest.fn(() => mocks.omieCategoryParsedMock),
    department: jest.fn(() => mocks.omieDepartmentParsedMock),
    project: jest.fn(() => mocks.omieProjectParsedMock),
    product: jest.fn(() => mocks.omieProductParsedMock),
    service: jest.fn(() => mocks.omieServiceParsedMock),
    customer: jest.fn(() => mocks.omieCustomerParsedMock),
    checkingAccount: jest.fn(() => mocks.omieCheckingAccountParsedMock),
    contract: jest.fn(() => mocks.omieContractParsedMock),
    productOrder: jest.fn(() => mocks.omieProductOrderParsedMock),
    serviceOrder: jest.fn(() => mocks.omieServiceOrderParsedMock),
    /** facts */
    productInvoice: jest.fn(() => mocks.omieProductInvoiceParsedMock),
    serviceInvoice: jest.fn(() => mocks.omieServiceInvoiceParsedMock),
    title: jest.fn().mockReturnValueOnce(mocks.omieAccountPayableParsedMock).mockReturnValueOnce(mocks.omieAccountReceivableParsedMock),
    financialMovement: jest.fn(() => mocks.omieFinancialMovementParsedMock)
  }

  const repositoriesMock = {
    /** dimensions */
    companies: {
      find: jest.fn(async () => mocks.omieCompaniesSavedMock),
      createOrUpdateOne: jest.fn(async () => null)
    },
    categories: {
      find: jest.fn(async () => mocks.omieCategoriesSavedMock),
      findOne: jest.fn(async () => mocks.emptyCategorySavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      createOrUpdateMany: jest.fn(async () => null)
    },
    departments: {
      find: jest.fn(async () => mocks.omieDepartmentsSavedMock),
      findOne: jest.fn(async () => mocks.emptyDepartmentSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      createOrUpdateMany: jest.fn(async () => null)
    },
    projects: {
      find: jest.fn(async () => mocks.omieProjectsSavedMock),
      findOne: jest.fn(async () => mocks.emptyProjectSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      createOrUpdateMany: jest.fn(async () => null)
    },
    customers: {
      find: jest.fn(async () => mocks.omieCustomersSavedMock),
      findOne: jest.fn(async () => mocks.emptyCustomerSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      createOrUpdateMany: jest.fn(async () => null)
    },
    productsServices: {
      find: jest.fn(async () => [...mocks.omieProductsSavedMock, ...mocks.omieServicesSavedMock]),
      findOne: jest.fn(async () => mocks.emptyProductServiceSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      createOrUpdateMany: jest.fn(async () => null)
    },
    checkingAccounts: {
      find: jest.fn(async () => mocks.omieCheckingAccountsSavedMock),
      findOne: jest.fn(async () => mocks.emptyCheckingAccountSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      createOrUpdateMany: jest.fn(async () => null)
    },
    contracts: {
      find: jest.fn(async () => mocks.omieContractsSavedMock),
      findOne: jest.fn(async () => mocks.emptyContractSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    orders: {
      find: jest.fn(async () => [...mocks.omieProductOrdersSavedMock, ...mocks.omieServiceOrdersSavedMock]),
      findOne: jest.fn(async () => mocks.emptyOrderSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    /** facts */
    billing: {
      find: jest.fn(async () => [...mocks.omieProductInvoicesSavedMock, ...mocks.omieServiceInvoicesSavedMock]),
      findOne: jest.fn(async () => mocks.emptyBillingSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsPayable: {
      find: jest.fn(async () => mocks.omieAccountsPayableSavedMock),
      findOne: jest.fn(async () => mocks.emptyAccountPayableSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsReceivable: {
      find: jest.fn(async () => []),
      findOne: jest.fn(async () => mocks.emptyAccountReceivableSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    financialMovements: {
      findOne: jest.fn(async () => mocks.emptyFinancialMovementSavedMock),
      createOrUpdateOneRaw: jest.fn(async () => null),
      deleteOldAndCreateNew: jest.fn(async () => null)
    }
  }

  const loggerMock = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const queuerMock = {
    sendCompanyToDataExportQueue: jest.fn(async () => 'https://the-queuer-url/data.json')
  }

  const useCase = makeUseCase({
    omieService: omieServiceMock,
    omieMappings: omieMappingsMock,
    repositories: repositoriesMock,
    logger: loggerMock,
    queuer: queuerMock
  })

  return {
    sut: useCase,
    payloadMock,
    companyIdMock,
    credentialsMock,
    omieServiceMock,
    omieMappingsMock,
    repositoriesMock,
    loggerMock,
    queuerMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    categoryIdMock,
    productIdMock,
    serviceIdMock,
    checkingAccountIdMock,
    contractIdMock,
    accountPayableIdMock,
    accountReceivableIdMock
  }
}

describe('ingestionPerformer UseCase', () => {
  it('Should call repositories.companies.find successfully', async () => {
    const { sut, payloadMock, repositoriesMock } = makeSut()
    await sut({ payload: payloadMock })
    expect(repositoriesMock.companies.find).toHaveBeenCalledWith({ isActive: true, _id: payloadMock.companyId })
  })

  describe('getAuxiliaryRecords', () => {
    it('Should call omieService methods successfully', async () => {
      const { sut, payloadMock, omieServiceMock } = makeSut()
      await sut({ payload: payloadMock })
      expect(omieServiceMock.getCnae).toHaveBeenCalledTimes(1)
      expect(omieServiceMock.getEntryOrigins).toHaveBeenCalledTimes(1)
      expect(omieServiceMock.getDocumentTypes).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateCompany', () => {
    it('Should call omieService methods successfully', async () => {
      const { sut, payloadMock, omieServiceMock } = makeSut()
      await sut({ payload: payloadMock })
      expect(omieServiceMock.getCompany).toHaveBeenCalledTimes(1)
    })

    it('Should call omieMappings.company successfully', async () => {
      const { sut, payloadMock, credentialsMock, omieMappingsMock } = makeSut()
      await sut({ payload: payloadMock })
      expect(omieMappingsMock.company).toHaveBeenCalledWith({ omieCompany: mocks.omieCompaniesResponseMock.empresas_cadastro[0], omieCnae: mocks.omieCnaeResponseMock.cadastros, credentials: credentialsMock })
      expect(omieMappingsMock.company).toHaveReturnedWith(mocks.omieCompanyParsedMock)
    })

    it('Should call repositories.companies.createOrUpdateOne successfully', async () => {
      const { sut, payloadMock, companyIdMock, repositoriesMock } = makeSut()
      await sut({ payload: payloadMock })
      expect(repositoriesMock.companies.createOrUpdateOne).toHaveBeenCalledWith({ _id: companyIdMock }, mocks.omieCompanyParsedMock)
    })
  })

  describe('createEmptyRecords', () => {
    it('Should create empty category successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.categories.findOne.mockReturnValueOnce(null)
      omieMappingsMock.category.mockReturnValueOnce(mocks.emptyCategoryParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.categories.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.category })
      expect(repositoriesMock.categories.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.category).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieCategory: mocks.omieCategoriesResponseMock.categoria_cadastro[0] })
      expect(omieMappingsMock.category).toHaveNthReturnedWith(1, mocks.emptyCategoryParsedMock)
      expect(repositoriesMock.categories.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty department successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.departments.findOne.mockReturnValueOnce(null)
      omieMappingsMock.department.mockReturnValueOnce(mocks.emptyDepartmentParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.departments.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.department })
      expect(repositoriesMock.departments.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.department).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieDepartment: mocks.omieDepartmentsResponseMock.departamentos[0] })
      expect(omieMappingsMock.department).toHaveNthReturnedWith(1, mocks.emptyDepartmentParsedMock)
      expect(repositoriesMock.departments.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty project successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.projects.findOne.mockReturnValueOnce(null)
      omieMappingsMock.project.mockReturnValueOnce(mocks.emptyProjectParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.projects.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.project })
      expect(repositoriesMock.projects.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.project).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieProject: mocks.omieProjectsResponseMock.cadastro[0] })
      expect(omieMappingsMock.project).toHaveNthReturnedWith(1, mocks.emptyProjectParsedMock)
      expect(repositoriesMock.projects.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty customer successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.customers.findOne.mockReturnValueOnce(null)
      omieMappingsMock.customer.mockReturnValueOnce(mocks.emptyCustomerParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.customers.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.customer })
      expect(repositoriesMock.customers.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.customer).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieCustomer: mocks.omieCustomersResponseMock.clientes_cadastro[0], omieCnae: [], omieActivities: [] })
      expect(omieMappingsMock.customer).toHaveNthReturnedWith(1, mocks.emptyCustomerParsedMock)
      expect(repositoriesMock.customers.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty productService successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.productsServices.findOne.mockReturnValueOnce(null)
      omieMappingsMock.product.mockReturnValueOnce(mocks.emptyProductServiceParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.productsServices.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.productService })
      expect(repositoriesMock.productsServices.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.product).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieProduct: mocks.omieProductsResponseMock.produto_servico_cadastro[0] })
      expect(omieMappingsMock.product).toHaveNthReturnedWith(1, mocks.emptyProductServiceParsedMock)
      expect(repositoriesMock.productsServices.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty checkingAccount successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.checkingAccounts.findOne.mockReturnValueOnce(null)
      omieMappingsMock.checkingAccount.mockReturnValueOnce(mocks.emptyCheckingAccountParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.checkingAccounts.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.checkingAccount })
      expect(repositoriesMock.checkingAccounts.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.checkingAccount).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieCheckingAccount: mocks.omieCheckingAccountsResponseMock.ListarContasCorrentes[0], omieBanks: [], omieCheckingAccountTypes: [] })
      expect(omieMappingsMock.checkingAccount).toHaveNthReturnedWith(1, mocks.emptyCheckingAccountParsedMock)
      expect(repositoriesMock.checkingAccounts.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty contract successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.contracts.findOne.mockReturnValueOnce(null)
      omieMappingsMock.contract.mockReturnValueOnce(mocks.emptyContractParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.contracts.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.contract })
      expect(repositoriesMock.contracts.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.contract).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieContract: mocks.omieContractsResponseMock.contratoCadastro[0], omieContractDepartment: mocks.omieContractsResponseMock.contratoCadastro[0].departamentos[0], omieContractItem: mocks.omieContractsResponseMock.contratoCadastro[0].itensContrato[0], omieContractBillingTypes: mocks.omieContractBillingTypesResponseMock.cadastros, omieContractSteps: mocks.omieContractStepsResponseMock, emptyRecordsIds: {} })
      expect(omieMappingsMock.contract).toHaveNthReturnedWith(1, mocks.emptyContractParsedMock)
      expect(repositoriesMock.contracts.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty order successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.orders.findOne.mockReturnValueOnce(null)
      omieMappingsMock.productOrder.mockReturnValueOnce(mocks.emptyOrderParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.orders.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.order })
      expect(repositoriesMock.orders.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.productOrder).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieOrder: mocks.omieProductOrdersResponseMock.pedido_venda_produto[0], omieOrderDepartment: mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].departamentos[0], omieOrderItem: mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].det[0], omieBillingSteps: mocks.omieBillingStepsResponseMock.cadastros, emptyRecordsIds: {} })
      expect(omieMappingsMock.productOrder).toHaveNthReturnedWith(1, mocks.emptyOrderParsedMock)
      expect(repositoriesMock.orders.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty billing successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.billing.findOne.mockReturnValueOnce(null)
      omieMappingsMock.productInvoice.mockReturnValueOnce(mocks.emptyBillingParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.billing.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.billing })
      expect(repositoriesMock.billing.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.productInvoice).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieInvoice: mocks.omieProductInvoicesResponseMock.nfCadastro[0], omieInvoiceDepartment: mocks.omieProductInvoicesResponseMock.nfCadastro[0].pedido.Departamentos[0], omieInvoiceItem: mocks.omieProductInvoicesResponseMock.nfCadastro[0].det[0], emptyRecordsIds: {}, order: {} })
      expect(omieMappingsMock.productInvoice).toHaveNthReturnedWith(1, mocks.emptyBillingParsedMock)
      expect(repositoriesMock.billing.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty accountPayable successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.accountsPayable.findOne.mockReturnValueOnce(null)
      omieMappingsMock.title.mockReturnValueOnce(mocks.emptyAccountPayableParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.accountsPayable.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.accountPayable })
      expect(repositoriesMock.accountsPayable.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.title).toHaveBeenCalledWith({ companyId: companyIdMock, omieTitle: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0], omieTitleEntry: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].lancamentos[0], omieTitleDepartment: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].departamentos[0], omieTitleCategory: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].cabecTitulo.aCodCateg[0], omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem, omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro, order: {}, billing: {}, emptyRecordsIds: {} })
      expect(omieMappingsMock.title).toHaveReturnedWith(mocks.emptyAccountPayableParsedMock)
      expect(repositoriesMock.accountsPayable.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty accountReceivable successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.accountsReceivable.findOne.mockReturnValueOnce(null)
      omieMappingsMock.title.mockReturnValueOnce(mocks.emptyAccountReceivableParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.accountsReceivable.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.accountReceivable })
      expect(repositoriesMock.accountsReceivable.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.title).toHaveBeenCalledWith({ companyId: companyIdMock, omieTitle: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0], omieTitleEntry: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].lancamentos[0], omieTitleDepartment: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].departamentos[0], omieTitleCategory: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].cabecTitulo.aCodCateg[0], omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem, omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro, order: {}, billing: {}, emptyRecordsIds: {} })
      expect(omieMappingsMock.title).toHaveReturnedWith(mocks.emptyAccountReceivableParsedMock)
      expect(repositoriesMock.accountsReceivable.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })

    it('Should create empty financialMovement successfully', async () => {
      const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
      repositoriesMock.financialMovements.findOne.mockReturnValueOnce(null)
      omieMappingsMock.financialMovement.mockReturnValueOnce(mocks.emptyFinancialMovementParsedMock)
      await sut({ payload: payloadMock })
      expect(repositoriesMock.financialMovements.findOne).toHaveBeenNthCalledWith(1, { _id: mocks.emptyRecordsIdsMock.financialMovement })
      expect(repositoriesMock.financialMovements.findOne).toHaveNthReturnedWith(1, null)
      expect(omieMappingsMock.financialMovement).toHaveBeenNthCalledWith(1, { companyId: companyIdMock, omieFinancialMovement: mocks.omieFinancialMovementsResponseMock.movimentos[0], omieFinancialMovementDepartment: mocks.omieFinancialMovementsResponseMock.movimentos[0].departamentos[0], omieFinancialMovementCategory: mocks.omieFinancialMovementsResponseMock.movimentos[0].categorias[0], omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem, omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro, emptyRecordsIds: {}, order: {}, billing: {} })
      expect(omieMappingsMock.financialMovement).toHaveNthReturnedWith(1, mocks.emptyFinancialMovementParsedMock)
      expect(repositoriesMock.financialMovements.createOrUpdateOneRaw).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateDimensions', () => {
    describe('updateCategories', () => {
      it('Should call omieService methods successfully', async () => {
        const { sut, payloadMock, omieServiceMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getCategories).toHaveBeenCalledTimes(1)
      })

      it('Should call omieMappings.category successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.category).toHaveBeenCalledWith({ omieCategory: mocks.omieCategoriesResponseMock.categoria_cadastro[0], companyId: companyIdMock })
        expect(omieMappingsMock.category).toHaveReturnedWith(mocks.omieCategoryParsedMock)
      })

      it('Should call repositories.categories.createOrUpdateMany successfully', async () => {
        const { sut, payloadMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(repositoriesMock.categories.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieCategoryParsedMock])
      })
    })

    describe('updateDepartments', () => {
      it('Should call omieService methods successfully', async () => {
        const { sut, payloadMock, omieServiceMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getDepartments).toHaveBeenCalledTimes(1)
      })

      it('Should call omieMappings.department successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.department).toHaveBeenCalledWith({ omieDepartment: mocks.omieDepartmentsResponseMock.departamentos[0], companyId: companyIdMock })
        expect(omieMappingsMock.department).toHaveReturnedWith(mocks.omieDepartmentParsedMock)
      })

      it('Should call repositories.departments.createOrUpdateMany successfully', async () => {
        const { sut, payloadMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(repositoriesMock.departments.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieDepartmentParsedMock])
      })
    })

    describe('updateProjects', () => {
      it('Should call omieService methods successfully', async () => {
        const { sut, payloadMock, omieServiceMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getProjects).toHaveBeenCalledTimes(1)
      })

      it('Should call omieMappings.project successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.project).toHaveBeenCalledWith({ omieProject: mocks.omieProjectsResponseMock.cadastro[0], companyId: companyIdMock })
        expect(omieMappingsMock.project).toHaveReturnedWith(mocks.omieProjectParsedMock)
      })

      it('Should call repositories.projects.createOrUpdateMany successfully', async () => {
        const { sut, payloadMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(repositoriesMock.projects.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieProjectParsedMock])
      })
    })

    describe('updateCustomers', () => {
      it('Should call omieService methods successfully', async () => {
        const { sut, payloadMock, omieServiceMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getCustomers).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getActivities).toHaveBeenCalledTimes(1)
      })

      it('Should call omieMappings.customer successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.customer).toHaveBeenCalledWith({ omieCustomer: mocks.omieCustomersResponseMock.clientes_cadastro[0], omieActivities: mocks.omieActivitiesResponseMock.lista_tipos_atividade, omieCnae: mocks.omieCnaeResponseMock.cadastros, companyId: companyIdMock })
        expect(omieMappingsMock.customer).toHaveReturnedWith(mocks.omieCustomerParsedMock)
      })

      it('Should call repositories.customers.createOrUpdateMany successfully', async () => {
        const { sut, payloadMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(repositoriesMock.customers.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieCustomerParsedMock])
      })
    })

    describe('updateProductsServices', () => {
      it('Should call omieService methods successfully', async () => {
        const { sut, payloadMock, omieServiceMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getProducts).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getServices).toHaveBeenCalledTimes(1)
      })

      it('Should call omieMappings.product successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.product).toHaveBeenCalledWith({ omieProduct: mocks.omieProductsResponseMock.produto_servico_cadastro[0], companyId: companyIdMock })
        expect(omieMappingsMock.product).toHaveReturnedWith(mocks.omieProductParsedMock)
      })

      it('Should call omieMappings.service successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.service).toHaveBeenCalledWith({ omieService: mocks.omieServicesResponseMock.cadastros[0], companyId: companyIdMock })
        expect(omieMappingsMock.service).toHaveReturnedWith(mocks.omieServiceParsedMock)
      })

      it('Should call repositories.productsServices.createOrUpdateMany successfully', async () => {
        const { sut, payloadMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(repositoriesMock.productsServices.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieProductParsedMock, mocks.omieServiceParsedMock])
      })
    })

    describe('updateCheckingAccounts', () => {
      it('Should call omieService methods successfully', async () => {
        const { sut, payloadMock, omieServiceMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getCheckingAccounts).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getBanks).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getCheckingAccountTypes).toHaveBeenCalledTimes(1)
      })

      it('Should call omieMappings.checkingAccount successfully', async () => {
        const { sut, payloadMock, companyIdMock, omieMappingsMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieMappingsMock.checkingAccount).toHaveBeenCalledWith({ omieCheckingAccount: mocks.omieCheckingAccountsResponseMock.ListarContasCorrentes[0], omieBanks: mocks.omieBanksResponseMock.fin_banco_cadastro, omieCheckingAccountTypes: mocks.omieCheckingAccountTypesResponseMock.cadastros, companyId: companyIdMock })
        expect(omieMappingsMock.checkingAccount).toHaveReturnedWith(mocks.omieCheckingAccountParsedMock)
      })

      it('Should call repositories.checkingAccounts.createOrUpdateMany successfully', async () => {
        const { sut, payloadMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(repositoriesMock.checkingAccounts.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieCheckingAccountParsedMock])
      })
    })

    describe('updateContracts', () => {
      describe('default scenario', () => {
        it('Should call all omieService methods successfully', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieServiceMock.getContracts).toHaveBeenCalledTimes(1)
          expect(omieServiceMock.getContractSteps).toHaveBeenCalledTimes(1)
          expect(omieServiceMock.getContractBillingTypes).toHaveBeenCalledTimes(1)
        })

        it('Should call omieMappings.contract successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, serviceIdMock, categoryIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.contract).toHaveBeenCalledWith({
            omieContract: mocks.omieContractsResponseMock.contratoCadastro[0],
            omieContractDepartment: mocks.omieContractsResponseMock.contratoCadastro[0].departamentos[0],
            omieContractItem: mocks.omieContractsResponseMock.contratoCadastro[0].itensContrato[0],
            omieContractBillingTypes: mocks.omieContractBillingTypesResponseMock.cadastros,
            omieContractSteps: mocks.omieContractStepsResponseMock,
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            productServiceId: serviceIdMock,
            categoryId: categoryIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.contract).toHaveReturnedWith(mocks.omieContractParsedMock)
        })

        it('Should call repositories.contracts.deleteOldAndCreateNew successfully', async () => {
          const { sut, payloadMock, repositoriesMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(repositoriesMock.contracts.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieContractParsedMock])
        })
      })

      describe('alternative scenarios', () => {
        it('Should receive contracts from Omie with departments array but missing department id', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          omieServiceMock.getContracts.mockResolvedValueOnce([{ ...mocks.omieContractsResponseMock.contratoCadastro[0], departamentos: [{}] }])
          await sut({ payload: payloadMock })
        })

        it('Should call omieMappings.contract successfully without relationships', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock } = makeSut()
          const omieContractMock = { ...mocks.omieContractsResponseMock.contratoCadastro[0], departamentos: [], cabecalho: { ...mocks.omieContractsResponseMock.contratoCadastro[0].cabecalho, nCodCli: undefined }, infAdic: { ...mocks.omieContractsResponseMock.contratoCadastro[0].infAdic, nCodProj: undefined }, itensContrato: [{ ...mocks.omieContractsResponseMock.contratoCadastro[0].itensContrato[0], itemCabecalho: { ...mocks.omieContractsResponseMock.contratoCadastro[0].itensContrato[0].itemCabecalho, codServico: undefined, cCodCategItem: undefined } }] }
          omieServiceMock.getContracts.mockResolvedValueOnce([omieContractMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.contract).toHaveBeenCalledWith({
            omieContract: omieContractMock,
            omieContractDepartment: {},
            omieContractItem: omieContractMock.itensContrato[0],
            omieContractBillingTypes: mocks.omieContractBillingTypesResponseMock.cadastros,
            omieContractSteps: mocks.omieContractStepsResponseMock,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            productServiceId: undefined,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.contract).toHaveReturnedWith(mocks.omieContractParsedMock)
        })
      })
    })

    describe('updateOrders', () => {
      describe('default scenario', () => {
        it('Should call all omieService methods successfully', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieServiceMock.getProductOrders).toHaveBeenCalledTimes(1)
          expect(omieServiceMock.getServiceOrders).toHaveBeenCalledTimes(1)
          expect(omieServiceMock.getBillingSteps).toHaveBeenCalledTimes(1)
        })

        it('Should call omieMappings.productOrder successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, productIdMock, categoryIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.productOrder).toHaveBeenCalledWith({
            omieOrder: mocks.omieProductOrdersResponseMock.pedido_venda_produto[0],
            omieOrderDepartment: mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].departamentos[0],
            omieOrderItem: mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].det[0],
            omieBillingSteps: mocks.omieBillingStepsResponseMock.cadastros,
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            productServiceId: productIdMock,
            categoryId: categoryIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.productOrder).toHaveReturnedWith(mocks.omieProductOrderParsedMock)
        })

        it('Should call omieMappings.serviceOrder successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, serviceIdMock, categoryIdMock, contractIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.serviceOrder).toHaveBeenCalledWith({
            omieOrder: mocks.omieServiceOrdersResponseMock.osCadastro[0],
            omieOrderDepartment: mocks.omieServiceOrdersResponseMock.osCadastro[0].Departamentos[0],
            omieOrderItem: mocks.omieServiceOrdersResponseMock.osCadastro[0].ServicosPrestados[0],
            omieBillingSteps: mocks.omieBillingStepsResponseMock.cadastros,
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            productServiceId: serviceIdMock,
            categoryId: categoryIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock
          })
          expect(omieMappingsMock.serviceOrder).toHaveReturnedWith(mocks.omieServiceOrderParsedMock)
        })

        it('Should call repositories.orders.deleteOldAndCreateNew successfully', async () => {
          const { sut, payloadMock, repositoriesMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(repositoriesMock.orders.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.omieProductOrderParsedMock, mocks.omieServiceOrderParsedMock])
        })
      })

      describe('alternative scenarios', () => {
        it('Should receive orders from Omie with departments array but missing department id', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          omieServiceMock.getProductOrders.mockResolvedValueOnce([{ ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0], departamentos: [{}] }])
          omieServiceMock.getServiceOrders.mockResolvedValueOnce([{ ...mocks.omieServiceOrdersResponseMock.osCadastro[0], Departamentos: [{}] }])
          await sut({ payload: payloadMock })
        })

        it('Should call omieMappings.serviceOrder and not call omieMappings.productOrder', async () => {
          const { sut, payloadMock, omieMappingsMock, omieServiceMock } = makeSut()
          omieServiceMock.getProductOrders.mockResolvedValueOnce([])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.serviceOrder).toHaveBeenCalled()
          expect(omieMappingsMock.productOrder).toHaveBeenCalledTimes(0)
        })

        it('Should call omieMappings.productOrder and omieMappings.serviceOrder successfully without relationships', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock } = makeSut()

          const omieProductOrderMock = { ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0], departamentos: [], cabecalho: { ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].cabecalho, codigo_cliente: undefined }, informacoes_adicionais: { ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].informacoes_adicionais, codProj: undefined }, det: [{ ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].det[0], inf_adic: { ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].det[0].inf_adic, codigo_categoria_item: undefined }, produto: { ...mocks.omieProductOrdersResponseMock.pedido_venda_produto[0].det[0].inf_adic.produto, codigo_produto: undefined } }] }
          omieServiceMock.getProductOrders.mockResolvedValueOnce([omieProductOrderMock])
          const omieServiceOrderMock = { ...mocks.omieServiceOrdersResponseMock.osCadastro[0], Departamentos: [], Cabecalho: { ...mocks.omieServiceOrdersResponseMock.osCadastro[0].Cabecalho, nCodCli: undefined }, InformacoesAdicionais: { ...mocks.omieServiceOrdersResponseMock.osCadastro[0].InformacoesAdicionais, nCodProj: undefined, cNumContrato: undefined }, ServicosPrestados: [{ ...mocks.omieServiceOrdersResponseMock.osCadastro[0].ServicosPrestados[0], cCodCategItem: undefined, nCodServico: undefined }] }
          omieServiceMock.getServiceOrders.mockResolvedValueOnce([omieServiceOrderMock])

          await sut({ payload: payloadMock })

          expect(omieMappingsMock.productOrder).toHaveBeenCalledWith({
            omieOrder: omieProductOrderMock,
            omieOrderDepartment: {},
            omieOrderItem: omieProductOrderMock.det[0],
            omieBillingSteps: mocks.omieBillingStepsResponseMock.cadastros,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            productServiceId: undefined,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.productOrder).toHaveReturnedWith(mocks.omieProductOrderParsedMock)

          expect(omieMappingsMock.serviceOrder).toHaveBeenCalledWith({
            omieOrder: omieServiceOrderMock,
            omieOrderDepartment: {},
            omieOrderItem: omieServiceOrderMock.ServicosPrestados[0],
            omieBillingSteps: mocks.omieBillingStepsResponseMock.cadastros,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            serviceServiceId: undefined,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.serviceOrder).toHaveReturnedWith(mocks.omieServiceOrderParsedMock)
        })
      })
    })
  })

  describe('updateFacts', () => {
    describe('updateBilling', () => {
      describe('default scenario', () => {
        it('Should call all omieService methods successfully', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieServiceMock.getProductInvoices).toHaveBeenCalledTimes(1)
          expect(omieServiceMock.getServiceInvoices).toHaveBeenCalledTimes(1)
        })

        it('Should call omieMappings.productInvoice successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, productIdMock, categoryIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.productInvoice).toHaveBeenCalledWith({
            omieInvoice: mocks.omieProductInvoicesResponseMock.nfCadastro[0],
            omieInvoiceDepartment: mocks.omieProductInvoicesResponseMock.nfCadastro[0].pedido.Departamentos[0],
            omieInvoiceItem: mocks.omieProductInvoicesResponseMock.nfCadastro[0].det[0],
            order: mocks.omieProductOrdersSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            productServiceId: productIdMock,
            categoryId: categoryIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.productInvoice).toHaveReturnedWith(mocks.omieProductInvoiceParsedMock)
        })

        it('Should call omieMappings.serviceInvoice successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, serviceIdMock, categoryIdMock, contractIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.serviceInvoice).toHaveBeenCalledWith({
            omieInvoice: mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0],
            omieInvoiceDepartment: mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0].OrdemServico.Departamentos[0],
            omieInvoiceItem: mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0].ListaServicos[0],
            order: mocks.omieServiceOrdersSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            productServiceId: serviceIdMock,
            categoryId: categoryIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock
          })
          expect(omieMappingsMock.serviceInvoice).toHaveReturnedWith(mocks.omieServiceInvoiceParsedMock)
        })

        it('Should call repositories.billing.deleteOldAndCreateNew successfully', async () => {
          const { sut, payloadMock, repositoriesMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(repositoriesMock.billing.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.omieProductInvoiceParsedMock, mocks.omieServiceInvoiceParsedMock])
        })
      })

      describe('alternative scenarios', () => {
        it('Should receive billing from Omie with departments array but missing department id', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          omieServiceMock.getProductInvoices.mockResolvedValueOnce([{ ...mocks.omieProductInvoicesResponseMock.nfCadastro[0], pedido: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].pedido, Departamentos: [{}] } }])
          omieServiceMock.getServiceInvoices.mockResolvedValueOnce([{ ...mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0], OrdemServico: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].OrdemServico, Departamentos: [{}] } }])
          await sut({ payload: payloadMock })
        })

        it('Should call omieMappings.serviceOrder and not call omieMappings.serviceInvoice', async () => {
          const { sut, payloadMock, omieMappingsMock, omieServiceMock } = makeSut()
          omieServiceMock.getProductInvoices.mockResolvedValueOnce([])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.serviceInvoice).toHaveBeenCalled()
          expect(omieMappingsMock.productInvoice).toHaveBeenCalledTimes(0)
        })

        it('Should call omieMappings.productInvoice successfully without relationships', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock } = makeSut()

          const omieProductInvoiceMock = { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0], pedido: { Departamentos: [] }, nfDestInt: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].nfDestInt, nCodCli: undefined }, compl: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].compl, nIdPedido: undefined }, det: [{ ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].det[0], nfProdInt: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].det[0].nfProdInt, nCodProd: undefined } }] }
          omieServiceMock.getProductInvoices.mockResolvedValueOnce([omieProductInvoiceMock])
          const omieServiceInvoiceMock = { ...mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0], OrdemServico: { Departamentos: [], nCodigoContrato: undefined, nCodigoOS: undefined }, Cabecalho: { ...mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0].Cabecalho, nCodigoCliente: undefined }, ListaServicos: [{ ...mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0].ListaServicos[0], CodigoServico: undefined }], Adicionais: { ...mocks.omieServiceInvoicesResponseMock.nfseEncontradas[0].Adicionais, nCodigoProjeto: undefined } }
          omieServiceMock.getServiceInvoices.mockResolvedValueOnce([omieServiceInvoiceMock])

          await sut({ payload: payloadMock })

          expect(omieMappingsMock.productInvoice).toHaveBeenCalledWith({
            omieInvoice: omieProductInvoiceMock,
            omieInvoiceDepartment: {},
            omieInvoiceItem: omieProductInvoiceMock.det[0],
            order: undefined,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            productServiceId: undefined,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.productInvoice).toHaveReturnedWith(mocks.omieProductInvoiceParsedMock)

          expect(omieMappingsMock.serviceInvoice).toHaveBeenCalledWith({
            omieInvoice: omieServiceInvoiceMock,
            omieInvoiceDepartment: {},
            omieInvoiceItem: omieServiceInvoiceMock.ListaServicos[0],
            order: undefined,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            productServiceId: undefined,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: undefined
          })
          expect(omieMappingsMock.serviceInvoice).toHaveReturnedWith(mocks.omieServiceInvoiceParsedMock)
        })

        it('Should call omieMappings.productInvoice successfully without order: undefined', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock, customerIdMock, departmentIdMock, productIdMock } = makeSut()
          const omieProductInvoiceMock = { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0], compl: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].compl, nIdPedido: undefined } }
          omieServiceMock.getProductInvoices.mockResolvedValueOnce([omieProductInvoiceMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.productInvoice).toHaveBeenCalledWith({
            omieInvoice: omieProductInvoiceMock,
            omieInvoiceDepartment: mocks.omieProductInvoicesResponseMock.nfCadastro[0].pedido.Departamentos[0],
            omieInvoiceItem: mocks.omieProductInvoicesResponseMock.nfCadastro[0].det[0],
            order: undefined,
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: undefined,
            departmentId: departmentIdMock,
            productServiceId: productIdMock,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.productInvoice).toHaveReturnedWith(mocks.omieProductInvoiceParsedMock)
        })

        it('Should call omieMappings.productInvoice successfully without order: 0', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock, customerIdMock, departmentIdMock, productIdMock } = makeSut()
          const omieProductInvoiceMock = { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0], compl: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].compl, nIdPedido: '0' } }
          omieServiceMock.getProductInvoices.mockResolvedValueOnce([omieProductInvoiceMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.productInvoice).toHaveBeenCalledWith({
            omieInvoice: omieProductInvoiceMock,
            omieInvoiceDepartment: mocks.omieProductInvoicesResponseMock.nfCadastro[0].pedido.Departamentos[0],
            omieInvoiceItem: mocks.omieProductInvoicesResponseMock.nfCadastro[0].det[0],
            order: undefined,
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: undefined,
            departmentId: departmentIdMock,
            productServiceId: productIdMock,
            categoryId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock
          })
          expect(omieMappingsMock.productInvoice).toHaveReturnedWith(mocks.omieProductInvoiceParsedMock)
        })

        it('Should not call omieMappings.productInvoice due to no matched order', async () => {
          const { sut, payloadMock, omieMappingsMock, omieServiceMock } = makeSut()
          const omieProductInvoiceMock = { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0], compl: { ...mocks.omieProductInvoicesResponseMock.nfCadastro[0].compl, nIdPedido: 123456 } }
          omieServiceMock.getProductInvoices.mockResolvedValueOnce([omieProductInvoiceMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.productInvoice).toHaveBeenCalledTimes(0)
        })
      })
    })

    describe('updateAccountsPayable', () => {
      describe('default scenario', () => {
        it('Should call all omieService methods successfully', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieServiceMock.getAccountsPayable).toHaveBeenCalledTimes(1)
        })

        it('Should call omieMappings.title successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.title).toHaveBeenCalledWith({
            omieTitle: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0],
            omieTitleDepartment: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].departamentos[0],
            omieTitleCategory: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].cabecTitulo.aCodCateg[0],
            omieTitleEntry: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].lancamentos[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock
          })
          expect(omieMappingsMock.title).toHaveNthReturnedWith(1, mocks.omieAccountPayableParsedMock)
        })

        it('Should call repositories.accountsPayable.deleteOldAndCreateNew successfully', async () => {
          const { sut, payloadMock, repositoriesMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(repositoriesMock.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'titleId'], [mocks.omieAccountPayableParsedMock])
        })
      })

      describe('alternative scenarios', () => {
        it('Should receive accountsPayable from Omie with departments array but missing department id', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          omieServiceMock.getAccountsPayable.mockResolvedValueOnce([{ ...mocks.omieAccountsPayableResponseMock.titulosEncontrados[0], departamentos: [{}] }])
          await sut({ payload: payloadMock })
        })

        it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock } = makeSut()
          const omieAccountPayableMock = { ...mocks.omieAccountsPayableResponseMock.titulosEncontrados[0], cabecTitulo: { ...mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
          omieServiceMock.getAccountsPayable.mockResolvedValueOnce([omieAccountPayableMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.title).toHaveBeenCalledWith({
            omieTitle: omieAccountPayableMock,
            omieTitleDepartment: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].departamentos[0],
            omieTitleCategory: { cCodCateg: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].cabecTitulo.cCodCateg },
            omieTitleEntry: mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].lancamentos[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock
          })
          expect(omieMappingsMock.title).toHaveNthReturnedWith(1, mocks.omieAccountPayableParsedMock)
        })

        it('Should call omieMappings.title successfully without relationships', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock } = makeSut()
          const omieAccountPayableMock = { ...mocks.omieAccountsPayableResponseMock.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.omieAccountsPayableResponseMock.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
          omieServiceMock.getAccountsPayable.mockResolvedValueOnce([omieAccountPayableMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.title).toHaveBeenCalledWith({
            omieTitle: omieAccountPayableMock,
            omieTitleDepartment: {},
            omieTitleCategory: {},
            omieTitleEntry: omieAccountPayableMock.lancamentos[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: undefined,
            billing: undefined,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            categoryId: undefined,
            checkingAccountId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: undefined
          })
          expect(omieMappingsMock.title).toHaveNthReturnedWith(1, mocks.omieAccountPayableParsedMock)
        })
      })
    })

    describe('updateAccountsReceivable', () => {
      describe('default scenario', () => {
        it('Should call all omieService methods successfully', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieServiceMock.getAccountsReceivable).toHaveBeenCalledTimes(1)
        })

        it('Should call omieMappings.title successfully', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.title).toHaveBeenCalledWith({
            omieTitle: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0],
            omieTitleDepartment: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].departamentos[0],
            omieTitleCategory: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].cabecTitulo.aCodCateg[0],
            omieTitleEntry: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].lancamentos[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock
          })
          expect(omieMappingsMock.title).toHaveNthReturnedWith(2, mocks.omieAccountReceivableParsedMock)
        })

        it('Should call repositories.accountsReceivable.deleteOldAndCreateNew successfully', async () => {
          const { sut, payloadMock, repositoriesMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(repositoriesMock.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'titleId'], [mocks.omieAccountReceivableParsedMock])
        })
      })

      describe('alternative scenarios', () => {
        it('Should receive accountsReceivable from Omie with departments array but missing department id', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          omieServiceMock.getAccountsReceivable.mockResolvedValueOnce([{ ...mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0], departamentos: [{}] }])
          await sut({ payload: payloadMock })
        })

        it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock } = makeSut()
          const omieAccountReceivableMock = { ...mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0], cabecTitulo: { ...mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
          omieServiceMock.getAccountsReceivable.mockResolvedValueOnce([omieAccountReceivableMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.title).toHaveBeenCalledWith({
            omieTitle: omieAccountReceivableMock,
            omieTitleDepartment: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].departamentos[0],
            omieTitleCategory: { cCodCateg: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].cabecTitulo.cCodCateg },
            omieTitleEntry: mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].lancamentos[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock
          })
          expect(omieMappingsMock.title).toHaveNthReturnedWith(2, mocks.omieAccountReceivableParsedMock)
        })

        it('Should call omieMappings.title successfully without relationships', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock } = makeSut()
          const omieAccountReceivableMock = { ...mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.omieAccountsReceivableResponseMock.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
          omieServiceMock.getAccountsReceivable.mockResolvedValueOnce([omieAccountReceivableMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.title).toHaveBeenCalledWith({
            omieTitle: omieAccountReceivableMock,
            omieTitleDepartment: {},
            omieTitleCategory: {},
            omieTitleEntry: omieAccountReceivableMock.lancamentos[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: undefined,
            billing: undefined,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            categoryId: undefined,
            checkingAccountId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: undefined
          })
          expect(omieMappingsMock.title).toHaveNthReturnedWith(2, mocks.omieAccountReceivableParsedMock)
        })
      })
    })

    describe('updateFinancialMovements', () => {
      describe('default scenario', () => {
        it('Should call all omieService methods successfully', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieServiceMock.getFinancialMovements).toHaveBeenCalledTimes(1)
        })

        it('Should call omieMappings.financialMovement successfully with accountPayable', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, accountPayableIdMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.financialMovement).toHaveBeenCalledWith({
            omieFinancialMovement: mocks.omieFinancialMovementsResponseMock.movimentos[0],
            omieFinancialMovementDepartment: mocks.omieFinancialMovementsResponseMock.movimentos[0].departamentos[0],
            omieFinancialMovementCategory: mocks.omieFinancialMovementsResponseMock.movimentos[0].categorias[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock,
            accountPayableId: accountPayableIdMock,
            accountReceivableId: undefined
          })
          expect(omieMappingsMock.financialMovement).toHaveReturnedWith(mocks.omieFinancialMovementParsedMock)
        })

        it('Should call repositories.financialMovements.deleteOldAndCreateNew successfully', async () => {
          const { sut, payloadMock, repositoriesMock } = makeSut()
          await sut({ payload: payloadMock })
          expect(repositoriesMock.financialMovements.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'movementId'], [mocks.omieFinancialMovementParsedMock])
        })
      })

      describe('alternative scenarios', () => {
        it('Should receive financialMovements from Omie with departments array but missing department id', async () => {
          const { sut, payloadMock, omieServiceMock } = makeSut()
          omieServiceMock.getFinancialMovements.mockResolvedValueOnce([{ ...mocks.omieFinancialMovementsResponseMock.movimentos[0], departamentos: [{}] }])
          await sut({ payload: payloadMock })
        })

        it('Should call omieMappings.financialMovement successfully with accountReceivable instead of accountPayable', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, repositoriesMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, accountReceivableIdMock } = makeSut()
          repositoriesMock.accountsPayable.find.mockResolvedValueOnce([])
          repositoriesMock.accountsReceivable.find.mockResolvedValueOnce(mocks.omieAccountsReceivableSavedMock)
          omieMappingsMock.financialMovement.mockReturnValueOnce({ ...mocks.omieFinancialMovementParsedMock, accountPayableId: null, accountReceivableId: accountReceivableIdMock })
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.financialMovement).toHaveBeenCalledWith({
            omieFinancialMovement: mocks.omieFinancialMovementsResponseMock.movimentos[0],
            omieFinancialMovementDepartment: mocks.omieFinancialMovementsResponseMock.movimentos[0].departamentos[0],
            omieFinancialMovementCategory: mocks.omieFinancialMovementsResponseMock.movimentos[0].categorias[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock,
            accountPayableId: undefined,
            accountReceivableId: accountReceivableIdMock
          })
          expect(omieMappingsMock.financialMovement).toHaveReturnedWith({ ...mocks.omieFinancialMovementParsedMock, accountPayableId: null, accountReceivableId: accountReceivableIdMock })
        })

        it('Should call omieMappings.financialMovement successfully without departments', async () => {
          const { sut, payloadMock, companyIdMock, omieServiceMock, omieMappingsMock, customerIdMock, projectIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, accountPayableIdMock } = makeSut()
          const omieFinancialMovementMock = { ...mocks.omieFinancialMovementsResponseMock.movimentos[0], departamentos: [] }
          omieServiceMock.getFinancialMovements.mockResolvedValueOnce([omieFinancialMovementMock])
          omieMappingsMock.financialMovement.mockReturnValueOnce({ ...mocks.omieFinancialMovementParsedMock, departmentId: mocks.emptyRecordsIdsMock.department })
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.financialMovement).toHaveBeenCalledWith({
            omieFinancialMovement: omieFinancialMovementMock,
            omieFinancialMovementDepartment: {},
            omieFinancialMovementCategory: mocks.omieFinancialMovementsResponseMock.movimentos[0].categorias[0],
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: undefined,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock,
            accountPayableId: accountPayableIdMock,
            accountReceivableId: undefined
          })
          expect(omieMappingsMock.financialMovement).toHaveReturnedWith({ ...mocks.omieFinancialMovementParsedMock, departmentId: mocks.emptyRecordsIdsMock.department })
        })

        it('Should call omieMappings.financialMovement successfully without categories list: use fixed category in title details', async () => {
          const { sut, payloadMock, companyIdMock, omieServiceMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, accountPayableIdMock } = makeSut()
          const omieFinancialMovementMock = { ...mocks.omieFinancialMovementsResponseMock.movimentos[0], categorias: [] }
          omieServiceMock.getFinancialMovements.mockResolvedValueOnce([omieFinancialMovementMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.financialMovement).toHaveBeenCalledWith({
            omieFinancialMovement: omieFinancialMovementMock,
            omieFinancialMovementDepartment: mocks.omieFinancialMovementsResponseMock.movimentos[0].departamentos[0],
            omieFinancialMovementCategory: { cCodCateg: mocks.omieFinancialMovementsResponseMock.movimentos[0].detalhes.cCodCateg },
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: mocks.omieServiceOrdersSavedMock[0],
            billing: mocks.omieServiceInvoicesSavedMock[0],
            companyId: companyIdMock,
            customerId: customerIdMock,
            projectId: projectIdMock,
            departmentId: departmentIdMock,
            categoryId: categoryIdMock,
            checkingAccountId: checkingAccountIdMock,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: contractIdMock,
            accountPayableId: accountPayableIdMock,
            accountReceivableId: undefined
          })
          expect(omieMappingsMock.financialMovement).toHaveReturnedWith(mocks.omieFinancialMovementParsedMock)
        })

        it('Should call omieMappings.financialMovement successfully without relationships', async () => {
          const { sut, payloadMock, companyIdMock, omieMappingsMock, omieServiceMock } = makeSut()
          const omieFinancialMovementMock = { ...mocks.omieFinancialMovementsResponseMock.movimentos[0], departamentos: [], categorias: [], detalhes: { ...mocks.omieFinancialMovementsResponseMock.movimentos[0].detalhes, nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined } }
          omieServiceMock.getFinancialMovements.mockResolvedValueOnce([omieFinancialMovementMock])
          await sut({ payload: payloadMock })
          expect(omieMappingsMock.financialMovement).toHaveBeenCalledWith({
            omieFinancialMovement: omieFinancialMovementMock,
            omieFinancialMovementDepartment: {},
            omieFinancialMovementCategory: { cCodCateg: undefined },
            omieEntryOrigins: mocks.omieEntryOriginsResponseMock.origem,
            omieDocumentTypes: mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro,
            order: undefined,
            billing: undefined,
            companyId: companyIdMock,
            customerId: undefined,
            projectId: undefined,
            departmentId: undefined,
            categoryId: undefined,
            checkingAccountId: undefined,
            emptyRecordsIds: mocks.emptyRecordsIdsMock,
            contractId: undefined,
            accountPayableId: undefined,
            accountReceivableId: undefined
          })
          expect(omieMappingsMock.financialMovement).toHaveReturnedWith(mocks.omieFinancialMovementParsedMock)
        })
      })
    })
  })

  it('Should call logger.info successfully', async () => {
    const { sut, payloadMock, loggerMock } = makeSut()
    await sut({ payload: payloadMock })
    expect(loggerMock.info).toHaveBeenCalledTimes(3)
  })

  it('Should call queuer.sendCompanyToDataExportQueue successfully', async () => {
    const { sut, payloadMock, queuerMock } = makeSut()
    await sut({ payload: payloadMock })
    expect(queuerMock.sendCompanyToDataExportQueue).toHaveBeenCalledWith(payloadMock.companyId)
  })

  it('Should return success', async () => {
    const { sut, payloadMock } = makeSut()
    const result = await sut({ payload: payloadMock })
    expect(result).toEqual({ success: true })
  })
})
