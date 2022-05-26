const config = require('../../../../src/config')
const makeUseCase = require('../../../../src/functions/ingestionPerformer/useCase')
const mocks = require('../../../mocks')

jest.useFakeTimers('modern').setSystemTime(new Date())

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
    getCnae: jest.fn(async () => mocks.omieCnaeResponseMock.cadastros),
    getEntryOrigins: jest.fn(async () => mocks.omieEntryOriginsResponseMock.origem),
    getDocumentTypes: jest.fn(async () => mocks.omieDocumentTypesResponseMock.tipo_documento_cadastro),
    getCompany: jest.fn(async () => mocks.omieCompaniesResponseMock.empresas_cadastro[0]),
    getCategories: jest.fn(async () => [mocks.omieCategoriesResponseMock.categoria_cadastro[0]]),
    getDepartments: jest.fn(async () => [mocks.omieDepartmentsResponseMock.departamentos[0]]),
    getProjects: jest.fn(async () => mocks.omieProjectsResponseMock.cadastro),
    getCustomers: jest.fn(async () => mocks.omieCustomersResponseMock.clientes_cadastro),
    getActivities: jest.fn(async () => mocks.omieActivitiesResponseMock.lista_tipos_atividade),
    getProducts: jest.fn(async () => mocks.omieProductsResponseMock.produto_servico_cadastro),
    getServices: jest.fn(async () => mocks.omieServicesResponseMock.cadastros),
    getCheckingAccounts: jest.fn(async () => mocks.omieCheckingAccountsResponseMock.ListarContasCorrentes),
    getBanks: jest.fn(async () => mocks.omieBanksResponseMock.fin_banco_cadastro),
    getCheckingAccountTypes: jest.fn(async () => mocks.omieCheckingAccountTypesResponseMock.cadastros),
    getContracts: jest.fn(async () => mocks.omieContractsResponseMock.contratoCadastro),
    getContractBillingTypes: jest.fn(async () => mocks.omieContractBillingTypesResponseMock.cadastros),
    getContractSteps: jest.fn(async () => mocks.omieContractStepsResponseMock),
    getProductOrders: jest.fn(async () => mocks.omieProductOrdersResponseMock.pedido_venda_produto),
    getServiceOrders: jest.fn(async () => mocks.omieServiceOrdersResponseMock.osCadastro),
    getBillingSteps: jest.fn(async () => mocks.omieBillingStepsResponseMock.cadastros),
    getProductInvoices: jest.fn(async () => mocks.omieProductInvoicesResponseMock.nfCadastro),
    getServiceInvoices: jest.fn(async () => mocks.omieServiceInvoicesResponseMock.nfseEncontradas),
    getAccountsPayable: jest.fn(async () => mocks.omieAccountsPayableResponseMock.titulosEncontrados),
    getAccountsReceivable: jest.fn(async () => mocks.omieAccountsReceivableResponseMock.titulosEncontrados),
    getFinancialMovements: jest.fn(async () => mocks.omieFinancialMovementsResponseMock.movimentos)
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
      createOrUpdateMany: jest.fn(async () => null)
    },
    departments: {
      find: jest.fn(async () => mocks.omieDepartmentsSavedMock),
      createOrUpdateMany: jest.fn(async () => null)
    },
    projects: {
      find: jest.fn(async () => mocks.omieProjectsSavedMock),
      createOrUpdateMany: jest.fn(async () => null)
    },
    customers: {
      find: jest.fn(async () => mocks.omieCustomersSavedMock),
      createOrUpdateMany: jest.fn(async () => null)
    },
    productsServices: {
      find: jest.fn(async () => [...mocks.omieProductsSavedMock, ...mocks.omieServicesSavedMock]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    checkingAccounts: {
      find: jest.fn(async () => mocks.omieCheckingAccountsSavedMock),
      createOrUpdateMany: jest.fn(async () => null)
    },
    contracts: {
      find: jest.fn(async () => mocks.omieContractsSavedMock),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    orders: {
      find: jest.fn(async () => [...mocks.omieProductOrdersSavedMock, ...mocks.omieServiceOrdersSavedMock]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    /** facts */
    billing: {
      find: jest.fn(async () => [...mocks.omieProductInvoicesSavedMock, ...mocks.omieServiceInvoicesSavedMock]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsPayable: {
      find: jest.fn(async () => mocks.omieAccountsPayableSavedMock),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsReceivable: {
      find: jest.fn(async () => []),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    financialMovements: {
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
    it('Should updated company successfully', async () => {
      const { sut, payloadMock, omieServiceMock, credentialsMock, omieMappingsMock, companyIdMock, repositoriesMock } = makeSut()
      await sut({ payload: payloadMock })
      expect(omieServiceMock.getCompany).toHaveBeenCalledTimes(1)
      expect(omieMappingsMock.company).toHaveBeenCalledWith({ omieCompany: mocks.omieCompaniesResponseMock.empresas_cadastro[0], omieCnae: mocks.omieCnaeResponseMock.cadastros, credentials: credentialsMock })
      expect(repositoriesMock.companies.createOrUpdateOne).toHaveBeenCalledWith({ _id: companyIdMock }, mocks.omieCompanyParsedMock)
    })
    it('Should updated company with inactive record successfully', async () => {
      const { sut, payloadMock, omieServiceMock, credentialsMock, omieMappingsMock, companyIdMock, repositoriesMock } = makeSut()
      const omieCompanyResponseMock = { ...mocks.omieCompaniesResponseMock.empresas_cadastro[0], inativa: 'S' }
      omieServiceMock.getCompany.mockResolvedValueOnce(omieCompanyResponseMock)
      omieMappingsMock.company.mockReturnValueOnce({ ...mocks.omieCompanyParsedMock, isActive: false })
      await sut({ payload: payloadMock })
      expect(omieServiceMock.getCompany).toHaveBeenCalledTimes(1)
      expect(omieMappingsMock.company).toHaveBeenCalledWith({ omieCompany: omieCompanyResponseMock, omieCnae: mocks.omieCnaeResponseMock.cadastros, credentials: credentialsMock })
      expect(repositoriesMock.companies.createOrUpdateOne).toHaveBeenCalledWith({ _id: companyIdMock }, {
        ...mocks.omieCompanyParsedMock,
        isActive: false,
        statusAt: new Date(),
        statusBy: config.app.user
      })
    })
  })

  describe('updateDimensions', () => {
    describe('updateCategories', () => {
      it('Should update categories successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getCategories).toHaveBeenCalledTimes(1)
        expect(omieMappingsMock.category).toHaveBeenCalledWith({ omieCategory: mocks.omieCategoriesResponseMock.categoria_cadastro[0], companyId: companyIdMock })
        expect(omieMappingsMock.category).toHaveReturnedWith(mocks.omieCategoryParsedMock)
        expect(repositoriesMock.categories.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieCategoryParsedMock, mocks.emptyCategoryMock])
      })
    })

    describe('updateDepartments', () => {
      it('Should update departments successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getDepartments).toHaveBeenCalledTimes(1)
        expect(omieMappingsMock.department).toHaveBeenCalledWith({ omieDepartment: mocks.omieDepartmentsResponseMock.departamentos[0], companyId: companyIdMock })
        expect(omieMappingsMock.department).toHaveReturnedWith(mocks.omieDepartmentParsedMock)
        expect(repositoriesMock.departments.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieDepartmentParsedMock, mocks.emptyDepartmentMock])
      })
    })

    describe('updateProjects', () => {
      it('Should update projects successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getProjects).toHaveBeenCalledTimes(1)
        expect(omieMappingsMock.project).toHaveBeenCalledWith({ omieProject: mocks.omieProjectsResponseMock.cadastro[0], companyId: companyIdMock })
        expect(omieMappingsMock.project).toHaveReturnedWith(mocks.omieProjectParsedMock)
        expect(repositoriesMock.projects.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieProjectParsedMock, mocks.emptyProjectMock])
      })
    })

    describe('updateCustomers', () => {
      it('Should update customers successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getCustomers).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getActivities).toHaveBeenCalledTimes(1)
        expect(omieMappingsMock.customer).toHaveBeenCalledWith({ omieCustomer: mocks.omieCustomersResponseMock.clientes_cadastro[0], omieActivities: mocks.omieActivitiesResponseMock.lista_tipos_atividade, omieCnae: mocks.omieCnaeResponseMock.cadastros, companyId: companyIdMock })
        expect(omieMappingsMock.customer).toHaveReturnedWith(mocks.omieCustomerParsedMock)
        expect(repositoriesMock.customers.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieCustomerParsedMock, mocks.emptyCustomerMock])
      })
    })

    describe('updateProductsServices', () => {
      it('Should update productsServices successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getProducts).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getServices).toHaveBeenCalledTimes(1)
        expect(omieMappingsMock.product).toHaveBeenCalledWith({ omieProduct: mocks.omieProductsResponseMock.produto_servico_cadastro[0], companyId: companyIdMock })
        expect(omieMappingsMock.product).toHaveReturnedWith(mocks.omieProductParsedMock)
        expect(omieMappingsMock.service).toHaveBeenCalledWith({ omieService: mocks.omieServicesResponseMock.cadastros[0], companyId: companyIdMock })
        expect(omieMappingsMock.service).toHaveReturnedWith(mocks.omieServiceParsedMock)
        expect(repositoriesMock.productsServices.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieProductParsedMock, mocks.omieServiceParsedMock, mocks.emptyProductServiceMock])
      })
    })

    describe('updateCheckingAccounts', () => {
      it('Should update checking accounts successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getCheckingAccounts).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getBanks).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getCheckingAccountTypes).toHaveBeenCalledTimes(1)
        expect(omieMappingsMock.checkingAccount).toHaveBeenCalledWith({ omieCheckingAccount: mocks.omieCheckingAccountsResponseMock.ListarContasCorrentes[0], omieBanks: mocks.omieBanksResponseMock.fin_banco_cadastro, omieCheckingAccountTypes: mocks.omieCheckingAccountTypesResponseMock.cadastros, companyId: companyIdMock })
        expect(omieMappingsMock.checkingAccount).toHaveReturnedWith(mocks.omieCheckingAccountParsedMock)
        expect(repositoriesMock.checkingAccounts.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieCheckingAccountParsedMock, mocks.emptyCheckingAccountMock])
      })
    })

    describe('updateContracts', () => {
      it('Should update contracts successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, serviceIdMock, categoryIdMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getContracts).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getContractSteps).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getContractBillingTypes).toHaveBeenCalledTimes(1)
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
        expect(repositoriesMock.contracts.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.omieContractParsedMock, mocks.emptyContractMock])
      })

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

    describe('updateOrders', () => {
      it('Should update orders successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, productIdMock, serviceIdMock, categoryIdMock, contractIdMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getProductOrders).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getServiceOrders).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getBillingSteps).toHaveBeenCalledTimes(1)
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
        expect(repositoriesMock.orders.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.omieProductOrderParsedMock, mocks.omieServiceOrderParsedMock, mocks.emptyOrderMock])
      })

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

  describe('updateFacts', () => {
    describe('updateBilling', () => {
      it('Should update billing successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, productIdMock, serviceIdMock, categoryIdMock, contractIdMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getProductInvoices).toHaveBeenCalledTimes(1)
        expect(omieServiceMock.getServiceInvoices).toHaveBeenCalledTimes(1)
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
        expect(repositoriesMock.billing.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.omieProductInvoiceParsedMock, mocks.omieServiceInvoiceParsedMock, mocks.emptyBillingMock])
      })

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

    describe('updateAccountsPayable', () => {
      it('Should update accounts payable successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getAccountsPayable).toHaveBeenCalledTimes(1)
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
        expect(repositoriesMock.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'titleId'], [mocks.omieAccountPayableParsedMock, mocks.emptyAccountPayableMock])
      })

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

    describe('updateAccountsReceivable', () => {
      it('Should update accounts receivable successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getAccountsReceivable).toHaveBeenCalledTimes(1)
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
        expect(repositoriesMock.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'titleId'], [mocks.omieAccountReceivableParsedMock, mocks.emptyAccountReceivableMock])
      })

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

    describe('updateFinancialMovements', () => {
      it('Should update successfully', async () => {
        const { sut, payloadMock, omieServiceMock, companyIdMock, omieMappingsMock, customerIdMock, projectIdMock, departmentIdMock, categoryIdMock, checkingAccountIdMock, contractIdMock, accountPayableIdMock, repositoriesMock } = makeSut()
        await sut({ payload: payloadMock })
        expect(omieServiceMock.getFinancialMovements).toHaveBeenCalledTimes(1)
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
        expect(repositoriesMock.financialMovements.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'movementId'], [mocks.omieFinancialMovementParsedMock, mocks.emptyFinancialMovementMock])
      })

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
