const makeService = require('../../../../src/functions/ingestionPerformer/service')
const { NotFoundException, UnprocessableEntityException } = require('../../../../src/common/errors')
const mocks = require('../../../mocks')

const makeSut = () => {
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockPayload = { companyId: mockCompanyId }
  const mockCredentials = { appKey: 'the_app_key', appSecret: 'the_app_secret' }
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const mockProductId = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const mockServiceId = 'e46a6ab1-dd50-4579-b11d-d939fd35bcf3'
  const mockCheckingAccountId = 'e5e74170-40ee-42d9-9741-6d708200e306'
  const mockContractId = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'
  const mockAccountPayable = '2f9671a0-1b1e-4e45-8f59-b76f10af37e1'
  const mockAccountReceivableId = '377f094b-a59b-4ca5-bad4-2ce20d636439'

  const mockOmieService = {
    getCnae: jest.fn(async () => mocks.mockOmieCnaeResponse.cadastros),
    getEntryOrigins: jest.fn(async () => mocks.mockOmieEntryOriginsResponse.origem),
    getDocumentTypes: jest.fn(async () => mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro),
    getCompany: jest.fn(async () => mocks.mockOmieCompaniesResponse.empresas_cadastro[0]),
    getCategories: jest.fn(async () => [mocks.mockOmieCategoriesResponse.categoria_cadastro[0]]),
    getDepartments: jest.fn(async () => [mocks.mockOmieDepartmentsResponse.departamentos[0]]),
    getProjects: jest.fn(async () => mocks.mockOmieProjectsResponse.cadastro),
    getCustomers: jest.fn(async () => mocks.mockOmieCustomersResponse.clientes_cadastro),
    getActivities: jest.fn(async () => mocks.mockOmieActivitiesResponse.lista_tipos_atividade),
    getProducts: jest.fn(async () => mocks.mockOmieProductsResponse.produto_servico_cadastro),
    getServices: jest.fn(async () => mocks.mockOmieServicesResponse.cadastros),
    getCheckingAccounts: jest.fn(async () => mocks.mockOmieCheckingAccountsResponse.ListarContasCorrentes),
    getBanks: jest.fn(async () => mocks.mockOmieBanksResponse.fin_banco_cadastro),
    getCheckingAccountTypes: jest.fn(async () => mocks.mockOmieCheckingAccountTypesResponse.cadastros),
    getContracts: jest.fn(async () => mocks.mockOmieContractsResponse.contratoCadastro),
    getContractBillingTypes: jest.fn(async () => mocks.mockOmieContractBillingTypesResponse.cadastros),
    getContractSteps: jest.fn(async () => mocks.mockOmieContractStepsResponse),
    getProductOrders: jest.fn(async () => mocks.mockOmieProductOrdersResponse.pedido_venda_produto),
    getServiceOrders: jest.fn(async () => mocks.mockOmieServiceOrdersResponse.osCadastro),
    getBillingSteps: jest.fn(async () => mocks.mockOmieBillingStepsResponse.cadastros),
    getProductInvoices: jest.fn(async () => mocks.mockOmieProductInvoicesResponse.nfCadastro),
    getServiceInvoices: jest.fn(async () => mocks.mockOmieServiceInvoicesResponse.nfseEncontradas),
    getAccountsPayable: jest.fn(async () => mocks.mockOmieAccountsPayableResponse.titulosEncontrados),
    getAccountsReceivable: jest.fn(async () => mocks.mockOmieAccountsReceivableResponse.titulosEncontrados),
    getFinancialMovements: jest.fn(async () => mocks.mockOmieFinancialMovementsResponse.movimentos)
  }

  const mockMappings = {
    /** dimensions */
    companyMapping: jest.fn(() => mocks.mockParsedOmieCompany),
    categoryMapping: jest.fn(() => mocks.mockParsedOmieCategory),
    departmentMapping: jest.fn(() => mocks.mockParsedOmieDepartment),
    projectMapping: jest.fn(() => mocks.mockParsedOmieProject),
    productMapping: jest.fn(() => mocks.mockParsedOmieProduct),
    serviceMapping: jest.fn(() => mocks.mockParsedOmieService),
    customerMapping: jest.fn(() => mocks.mockParsedOmieCustomer),
    checkingAccountMapping: jest.fn(() => mocks.mockParsedOmieCheckingAccount),
    contractMapping: jest.fn(() => mocks.mockParsedOmieContract),
    productOrderMapping: jest.fn(() => mocks.mockParsedOmieProductOrder),
    serviceOrderMapping: jest.fn(() => mocks.mockParsedOmieServiceOrder),
    /** facts */
    productInvoiceMapping: jest.fn(() => mocks.mockParsedOmieProductInvoice),
    serviceInvoiceMapping: jest.fn(() => mocks.mockParsedOmieServiceInvoice),
    titleMapping: jest.fn().mockReturnValueOnce(mocks.mockParsedOmieAccountPayable).mockReturnValueOnce(mocks.mockParsedOmieAccountReceivable),
    financialMovementMapping: jest.fn(() => mocks.mockParsedOmieFinancialMovement)
  }

  const mockCompaniesRepository = {
    findById: jest.fn(async () => mocks.mockSavedOmieCompanies[0]),
    update: jest.fn(async () => null)
  }

  const mockRepositories = {
    /** dimensions */
    companies: {
      findOne: jest.fn(async () => mocks.mockSavedOmieCompanies[0])
    },
    categories: {
      findMany: jest.fn(async () => mocks.mockSavedOmieCategories),
      createOrUpdateMany: jest.fn(async () => null)
    },
    departments: {
      findMany: jest.fn(async () => mocks.mockSavedOmieDepartments),
      createOrUpdateMany: jest.fn(async () => null)
    },
    projects: {
      findMany: jest.fn(async () => mocks.mockSavedOmieProjects),
      createOrUpdateMany: jest.fn(async () => null)
    },
    customers: {
      findMany: jest.fn(async () => mocks.mockSavedOmieCustomers),
      createOrUpdateMany: jest.fn(async () => null)
    },
    productsServices: {
      findMany: jest.fn(async () => [...mocks.mockSavedOmieProducts, ...mocks.mockSavedOmieServices]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    checkingAccounts: {
      findMany: jest.fn(async () => mocks.mockSavedOmieCheckingAccounts),
      createOrUpdateMany: jest.fn(async () => null)
    },
    contracts: {
      findMany: jest.fn(async () => mocks.mockSavedOmieContracts),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    orders: {
      findMany: jest.fn(async () => [...mocks.mockSavedOmieProductOrders, ...mocks.mockSavedOmieServiceOrders]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    /** facts */
    billing: {
      findMany: jest.fn(async () => [...mocks.mockSavedOmieProductInvoices, ...mocks.mockSavedOmieServiceInvoices]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsPayable: {
      findMany: jest.fn(async () => mocks.mockSavedOmieAccountsPayable),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsReceivable: {
      findMany: jest.fn(async () => []),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    financialMovements: {
      deleteOldAndCreateNew: jest.fn(async () => null)
    }
  }

  const mockLogger = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const mockSQS = {
    sendCompanyToDataExportQueue: jest.fn(async () => null)
  }

  const service = makeService({
    omieService: mockOmieService,
    mappings: mockMappings,
    companiesRepository: mockCompaniesRepository,
    repositories: mockRepositories,
    logger: mockLogger,
    sqs: mockSQS
  })

  return {
    sut: service,
    mockPayload,
    mockCompanyId,
    mockCredentials,
    mockOmieService,
    mockMappings,
    mockCompaniesRepository,
    mockRepositories,
    mockLogger,
    mockSQS,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockCategoryId,
    mockProductId,
    mockServiceId,
    mockCheckingAccountId,
    mockContractId,
    mockAccountPayable,
    mockAccountReceivableId
  }
}

beforeEach(() => {
  jest.useFakeTimers('modern').setSystemTime(new Date())
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('ingestionPerformer service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockCompaniesRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockPayload.companyId = 'any-invalid-or-non-existing-id'
    mockCompaniesRepository.findById.mockResolvedValue(null)
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe(`Company ${mockPayload.companyId} not found`)
    }
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(mockPayload.companyId)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should find company but throws a UnprocessableEntityException', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockCompaniesRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockCompaniesRepository.findById.mockResolvedValue({ ...mocks.mockSavedOmieCompanies[0], isActive: false })
    try {
      await sut(mockPayload)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.message).toBe(`Company ${mockPayload.companyId} is not active`)
    }
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(mockPayload.companyId)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should call companiesRepository.findById successfully', async () => {
    const { sut, mockPayload, mockCompaniesRepository } = makeSut()
    await sut(mockPayload)
    expect(mockCompaniesRepository.findById).toHaveBeenCalledWith(mockPayload.companyId)
  })

  describe('updateCompany', () => {
    it('Should updated company successfully', async () => {
      const { sut, mockPayload, mockOmieService, mockCredentials, mockMappings, mockCompanyId, mockCompaniesRepository } = makeSut()
      await sut(mockPayload)
      expect(mockOmieService.getCompany).toHaveBeenCalledTimes(1)
      expect(mockMappings.companyMapping).toHaveBeenCalledWith({ omieCompany: mocks.mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mocks.mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
      expect(mockCompaniesRepository.update).toHaveBeenCalledWith({ id: mockCompanyId, ...mocks.mockParsedOmieCompany })
    })

    it('Should updated company with inactive record successfully', async () => {
      const { sut, mockPayload, mockOmieService, mockCredentials, mockMappings, mockCompanyId, mockCompaniesRepository } = makeSut()
      const mockOmieCompanyResponse = { ...mocks.mockOmieCompaniesResponse.empresas_cadastro[0], inativa: 'S' }
      mockOmieService.getCompany.mockResolvedValue(mockOmieCompanyResponse)
      mockMappings.companyMapping.mockReturnValueOnce({ ...mocks.mockParsedOmieCompany, isActive: false })
      await sut(mockPayload)
      expect(mockOmieService.getCompany).toHaveBeenCalledTimes(1)
      expect(mockMappings.companyMapping).toHaveBeenCalledWith({ omieCompany: mockOmieCompanyResponse, omieCnae: mocks.mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
      expect(mockCompaniesRepository.update).toHaveBeenCalledWith({ id: mockCompanyId, ...mocks.mockParsedOmieCompany, isActive: false })
    })
  })

  describe('updateDimensions', () => {
    describe('updateCategories', () => {
      it('Should update categories successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getCategories).toHaveBeenCalledTimes(1)
        expect(mockMappings.categoryMapping).toHaveBeenCalledWith({ omieCategory: mocks.mockOmieCategoriesResponse.categoria_cadastro[0], companyId: mockCompanyId })
        expect(mockMappings.categoryMapping).toHaveReturnedWith(mocks.mockParsedOmieCategory)
        expect(mockRepositories.categories.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockParsedOmieCategory], ['companyId', 'externalId'])
      })
    })

    describe('updateDepartments', () => {
      it('Should update departments successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getDepartments).toHaveBeenCalledTimes(1)
        expect(mockMappings.departmentMapping).toHaveBeenCalledWith({ omieDepartment: mocks.mockOmieDepartmentsResponse.departamentos[0], companyId: mockCompanyId })
        expect(mockMappings.departmentMapping).toHaveReturnedWith(mocks.mockParsedOmieDepartment)
        expect(mockRepositories.departments.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockParsedOmieDepartment], ['companyId', 'externalId'])
      })
    })

    describe('updateProjects', () => {
      it('Should update projects successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getProjects).toHaveBeenCalledTimes(1)
        expect(mockMappings.projectMapping).toHaveBeenCalledWith({ omieProject: mocks.mockOmieProjectsResponse.cadastro[0], companyId: mockCompanyId })
        expect(mockMappings.projectMapping).toHaveReturnedWith(mocks.mockParsedOmieProject)
        expect(mockRepositories.projects.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockParsedOmieProject], ['companyId', 'externalId'])
      })
    })

    describe('updateCustomers', () => {
      it('Should update customers successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getCustomers).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getActivities).toHaveBeenCalledTimes(1)
        expect(mockMappings.customerMapping).toHaveBeenCalledWith({ omieCustomer: mocks.mockOmieCustomersResponse.clientes_cadastro[0], omieActivities: mocks.mockOmieActivitiesResponse.lista_tipos_atividade, omieBanks: mocks.mockOmieBanksResponse.fin_banco_cadastro, omieCnae: mocks.mockOmieCnaeResponse.cadastros, companyId: mockCompanyId })
        expect(mockMappings.customerMapping).toHaveReturnedWith(mocks.mockParsedOmieCustomer)
        expect(mockRepositories.customers.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockParsedOmieCustomer], ['companyId', 'externalId'])
      })
    })

    describe('updateProductsServices', () => {
      it('Should update productsServices successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getProducts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServices).toHaveBeenCalledTimes(2)
        expect(mockMappings.productMapping).toHaveBeenCalledWith({ omieProduct: mocks.mockOmieProductsResponse.produto_servico_cadastro[0], companyId: mockCompanyId })
        expect(mockMappings.productMapping).toHaveReturnedWith(mocks.mockParsedOmieProduct)
        expect(mockMappings.serviceMapping).toHaveBeenCalledWith({ omieService: mocks.mockOmieServicesResponse.cadastros[0], companyId: mockCompanyId })
        expect(mockMappings.serviceMapping).toHaveReturnedWith(mocks.mockParsedOmieService)
        expect(mockRepositories.productsServices.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockParsedOmieProduct, mocks.mockParsedOmieService], ['companyId', 'externalId'])
      })
    })

    describe('updateCheckingAccounts', () => {
      it('Should update checking accounts successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getCheckingAccounts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getCheckingAccountTypes).toHaveBeenCalledTimes(1)
        expect(mockMappings.checkingAccountMapping).toHaveBeenCalledWith({ omieCheckingAccount: mocks.mockOmieCheckingAccountsResponse.ListarContasCorrentes[0], omieBanks: mocks.mockOmieBanksResponse.fin_banco_cadastro, omieCheckingAccountTypes: mocks.mockOmieCheckingAccountTypesResponse.cadastros, companyId: mockCompanyId })
        expect(mockMappings.checkingAccountMapping).toHaveReturnedWith(mocks.mockParsedOmieCheckingAccount)
        expect(mockRepositories.checkingAccounts.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockParsedOmieCheckingAccount], ['companyId', 'externalId'])
      })
    })

    describe('updateContracts', () => {
      it('Should update contracts successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockServiceId, mockCategoryId, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getContracts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getContractSteps).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getContractBillingTypes).toHaveBeenCalledTimes(1)
        expect(mockMappings.contractMapping).toHaveBeenCalledWith({
          omieContract: mocks.mockOmieContractsResponse.contratoCadastro[0],
          omieContractDepartment: mocks.mockOmieContractsResponse.contratoCadastro[0].departamentos[0],
          omieContractItem: mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0],
          omieContractBillingTypes: mocks.mockOmieContractBillingTypesResponse.cadastros,
          omieContractSteps: mocks.mockOmieContractStepsResponse,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockServiceId,
          categoryId: mockCategoryId
        })
        expect(mockMappings.contractMapping).toHaveReturnedWith(mocks.mockParsedOmieContract)
        expect(mockRepositories.contracts.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieContract], ['companyId', 'externalId', 'type'])
      })

      it('Should receive contracts from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getContracts.mockResolvedValue([{ ...mocks.mockOmieContractsResponse.contratoCadastro[0], departamentos: [{}] }])
        await sut(mockPayload)
      })

      it('Should call omieMappings.contract successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieContract = { ...mocks.mockOmieContractsResponse.contratoCadastro[0], departamentos: [], cabecalho: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].cabecalho, nCodCli: undefined }, infAdic: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].infAdic, nCodProj: undefined }, itensContrato: [{ ...mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0], itemCabecalho: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0].itemCabecalho, codServico: undefined, cCodCategItem: undefined } }] }
        mockOmieService.getContracts.mockResolvedValue([mockOmieContract])
        await sut(mockPayload)
        expect(mockMappings.contractMapping).toHaveBeenCalledWith({
          omieContract: mockOmieContract,
          omieContractDepartment: {},
          omieContractItem: mockOmieContract.itensContrato[0],
          omieContractBillingTypes: mocks.mockOmieContractBillingTypesResponse.cadastros,
          omieContractSteps: mocks.mockOmieContractStepsResponse,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          productServiceId: undefined,
          categoryId: undefined
        })
        expect(mockMappings.contractMapping).toHaveReturnedWith(mocks.mockParsedOmieContract)
      })
    })

    describe('updateOrders', () => {
      it('Should update orders successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockProductId, mockServiceId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getProductOrders).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServiceOrders).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getBillingSteps).toHaveBeenCalledTimes(1)
        expect(mockMappings.productOrderMapping).toHaveBeenCalledWith({
          omieOrder: mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0],
          omieOrderDepartment: mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].departamentos[0],
          omieOrderItem: mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: mockCategoryId
        })
        expect(mockMappings.productOrderMapping).toHaveReturnedWith(mocks.mockParsedOmieProductOrder)
        expect(mockMappings.serviceOrderMapping).toHaveBeenCalledWith({
          omieOrder: mocks.mockOmieServiceOrdersResponse.osCadastro[0],
          omieOrderDepartment: mocks.mockOmieServiceOrdersResponse.osCadastro[0].Departamentos[0],
          omieOrderItem: mocks.mockOmieServiceOrdersResponse.osCadastro[0].ServicosPrestados[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockServiceId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.serviceOrderMapping).toHaveReturnedWith(mocks.mockParsedOmieServiceOrder)
        expect(mockRepositories.orders.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieProductOrder, mocks.mockParsedOmieServiceOrder], ['companyId', 'externalId', 'type'])
      })

      it('Should receive orders from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getProductOrders.mockResolvedValue([{ ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0], departamentos: [{}] }])
        mockOmieService.getServiceOrders.mockResolvedValue([{ ...mocks.mockOmieServiceOrdersResponse.osCadastro[0], Departamentos: [{}] }])
        await sut(mockPayload)
      })

      it('Should call omieMappings.serviceOrder and not call omieMappings.productOrder', async () => {
        const { sut, mockPayload, mockMappings, mockOmieService } = makeSut()
        mockOmieService.getProductOrders.mockResolvedValue([])
        await sut(mockPayload)
        expect(mockMappings.serviceOrderMapping).toHaveBeenCalled()
        expect(mockMappings.productOrderMapping).toHaveBeenCalledTimes(0)
      })

      it('Should call omieMappings.productOrder and omieMappings.serviceOrder successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService } = makeSut()

        const mockOmieProductOrder = { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0], departamentos: [], cabecalho: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].cabecalho, codigo_cliente: undefined }, informacoes_adicionais: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].informacoes_adicionais, codProj: undefined }, det: [{ ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0], inf_adic: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0].inf_adic, codigo_categoria_item: undefined }, produto: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0].inf_adic.produto, codigo_produto: undefined } }] }
        mockOmieService.getProductOrders.mockResolvedValue([mockOmieProductOrder])
        const mockOmieServiceOrder = { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0], Departamentos: [], Cabecalho: { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].Cabecalho, nCodCli: undefined }, InformacoesAdicionais: { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].InformacoesAdicionais, nCodProj: undefined, cNumContrato: undefined }, ServicosPrestados: [{ ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].ServicosPrestados[0], cCodCategItem: undefined, nCodServico: undefined }] }
        mockOmieService.getServiceOrders.mockResolvedValue([mockOmieServiceOrder])

        await sut(mockPayload)

        expect(mockMappings.productOrderMapping).toHaveBeenCalledWith({
          omieOrder: mockOmieProductOrder,
          omieOrderDepartment: {},
          omieOrderItem: mockOmieProductOrder.det[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          productServiceId: undefined,
          categoryId: undefined
        })
        expect(mockMappings.productOrderMapping).toHaveReturnedWith(mocks.mockParsedOmieProductOrder)

        expect(mockMappings.serviceOrderMapping).toHaveBeenCalledWith({
          omieOrder: mockOmieServiceOrder,
          omieOrderDepartment: {},
          omieOrderItem: mockOmieServiceOrder.ServicosPrestados[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          serviceServiceId: undefined,
          categoryId: undefined
        })
        expect(mockMappings.serviceOrderMapping).toHaveReturnedWith(mocks.mockParsedOmieServiceOrder)
      })
    })
  })

  describe('updateFacts', () => {
    describe('updateBilling', () => {
      it('Should update billing successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockProductId, mockServiceId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getProductInvoices).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServiceInvoices).toHaveBeenCalledTimes(1)
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mocks.mockOmieProductInvoicesResponse.nfCadastro[0],
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: mocks.mockSavedOmieProductOrders[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: mockCategoryId
        })
        expect(mockMappings.productInvoiceMapping).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)
        expect(mockMappings.serviceInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0],
          omieInvoiceDepartment: mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].OrdemServico.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].ListaServicos[0],
          order: mocks.mockSavedOmieServiceOrders[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockServiceId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.serviceInvoiceMapping).toHaveReturnedWith(mocks.mockParsedOmieServiceInvoice)
        expect(mockRepositories.billing.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieProductInvoice, mocks.mockParsedOmieServiceInvoice], ['companyId', 'externalId', 'type'])
      })

      it('Should receive billing from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getProductInvoices.mockResolvedValue([{ ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], pedido: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido, Departamentos: [{}] } }])
        mockOmieService.getServiceInvoices.mockResolvedValue([{ ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0], OrdemServico: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].OrdemServico, Departamentos: [{}] } }])
        await sut(mockPayload)
      })

      it('Should call omieMappings.serviceOrder and not call omieMappings.serviceInvoice', async () => {
        const { sut, mockPayload, mockMappings, mockOmieService } = makeSut()
        mockOmieService.getProductInvoices.mockResolvedValue([])
        await sut(mockPayload)
        expect(mockMappings.serviceInvoiceMapping).toHaveBeenCalled()
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledTimes(0)
      })

      it('Should call omieMappings.productInvoice successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService } = makeSut()

        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], pedido: { Departamentos: [] }, nfDestInt: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].nfDestInt, nCodCli: undefined }, compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: undefined }, det: [{ ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0], nfProdInt: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0].nfProdInt, nCodProd: undefined } }] }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        const mockOmieServiceInvoice = { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0], OrdemServico: { Departamentos: [], nCodigoContrato: undefined, nCodigoOS: undefined }, Cabecalho: { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].Cabecalho, nCodigoCliente: undefined }, ListaServicos: [{ ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].ListaServicos[0], CodigoServico: undefined }], Adicionais: { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].Adicionais, nCodigoProjeto: undefined } }
        mockOmieService.getServiceInvoices.mockResolvedValue([mockOmieServiceInvoice])

        await sut(mockPayload)

        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mockOmieProductInvoice,
          omieInvoiceDepartment: {},
          omieInvoiceItem: mockOmieProductInvoice.det[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          productServiceId: undefined,
          categoryId: undefined
        })
        expect(mockMappings.productInvoiceMapping).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)

        expect(mockMappings.serviceInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mockOmieServiceInvoice,
          omieInvoiceDepartment: {},
          omieInvoiceItem: mockOmieServiceInvoice.ListaServicos[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          productServiceId: undefined,
          categoryId: undefined,
          contractId: undefined
        })
        expect(mockMappings.serviceInvoiceMapping).toHaveReturnedWith(mocks.mockParsedOmieServiceInvoice)
      })

      it('Should call omieMappings.productInvoice successfully without order: undefined', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockDepartmentId, mockProductId } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: undefined } }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        await sut(mockPayload)
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mockOmieProductInvoice,
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: undefined,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: undefined
        })
        expect(mockMappings.productInvoiceMapping).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)
      })

      it('Should call omieMappings.productInvoice successfully without order: 0', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockDepartmentId, mockProductId } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: '0' } }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        await sut(mockPayload)
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mockOmieProductInvoice,
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: undefined,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: undefined
        })
        expect(mockMappings.productInvoiceMapping).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)
      })

      it('Should not call omieMappings.productInvoice due to no matched order', async () => {
        const { sut, mockPayload, mockMappings, mockOmieService } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: 123456 } }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        await sut(mockPayload)
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledTimes(0)
      })
    })

    describe('updateAccountsPayable', () => {
      it('Should update accounts payable successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getAccountsPayable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0],
          omieTitleDepartment: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo.aCodCateg[0],
          omieTitleEntries: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
        expect(mockRepositories.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieAccountPayable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should receive accountsPayable from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getAccountsPayable.mockResolvedValue([{ ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], departamentos: [{}] }])
        await sut(mockPayload)
      })

      it('Should call omieMappings.title without title entries', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], lancamentos: undefined }
        mockOmieService.getAccountsPayable.mockResolvedValue([mockOmieAccountPayable])
        await sut(mockPayload)
        expect(mockOmieService.getAccountsPayable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountPayable,
          omieTitleDepartment: mockOmieAccountPayable.departamentos[0],
          omieTitleCategory: mockOmieAccountPayable.cabecTitulo.aCodCateg[0],
          omieTitleEntries: [],
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
        expect(mockRepositories.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieAccountPayable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], cabecTitulo: { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
        mockOmieService.getAccountsPayable.mockResolvedValue([mockOmieAccountPayable])
        await sut(mockPayload)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountPayable,
          omieTitleDepartment: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: { cCodCateg: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo.cCodCateg },
          omieTitleEntries: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
      })

      it('Should call omieMappings.title successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
        mockOmieService.getAccountsPayable.mockResolvedValue([mockOmieAccountPayable])
        await sut(mockPayload)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountPayable,
          omieTitleDepartment: {},
          omieTitleCategory: {},
          omieTitleEntries: mockOmieAccountPayable.lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: undefined,
          billing: undefined,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          categoryId: undefined,
          contractId: undefined
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
      })
    })

    describe('updateAccountsReceivable', () => {
      it('Should update accounts receivable successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getAccountsReceivable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0],
          omieTitleDepartment: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo.aCodCateg[0],
          omieTitleEntries: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
        expect(mockRepositories.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieAccountReceivable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should call omieMappings.title without title entries', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], lancamentos: undefined }
        mockOmieService.getAccountsReceivable.mockResolvedValue([mockOmieAccountReceivable])
        await sut(mockPayload)
        expect(mockOmieService.getAccountsReceivable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountReceivable,
          omieTitleDepartment: mockOmieAccountReceivable.departamentos[0],
          omieTitleCategory: mockOmieAccountReceivable.cabecTitulo.aCodCateg[0],
          omieTitleEntries: [],
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
        expect(mockRepositories.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieAccountReceivable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should receive accountsReceivable from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getAccountsReceivable.mockResolvedValue([{ ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], departamentos: [{}] }])
        await sut(mockPayload)
      })

      it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], cabecTitulo: { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
        mockOmieService.getAccountsReceivable.mockResolvedValue([mockOmieAccountReceivable])
        await sut(mockPayload)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountReceivable,
          omieTitleDepartment: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: { cCodCateg: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo.cCodCateg },
          omieTitleEntries: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
      })

      it('Should call omieMappings.title successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
        mockOmieService.getAccountsReceivable.mockResolvedValue([mockOmieAccountReceivable])
        await sut(mockPayload)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountReceivable,
          omieTitleDepartment: {},
          omieTitleCategory: {},
          omieTitleEntries: mockOmieAccountReceivable.lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: undefined,
          billing: undefined,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          categoryId: undefined,
          contractId: undefined
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
      })
    })

    describe('updateFinancialMovements', () => {
      it('Should update successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable, mockRepositories } = makeSut()
        await sut(mockPayload)
        expect(mockOmieService.getEntryOrigins).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getFinancialMovements).toHaveBeenCalledTimes(2)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mocks.mockOmieFinancialMovementsResponse.movimentos[0],
          omieFinancialMovementDepartment: mocks.mockOmieFinancialMovementsResponse.movimentos[0].departamentos[0],
          omieFinancialMovementCategory: mocks.mockOmieFinancialMovementsResponse.movimentos[0].categorias[0],
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          checkingAccountId: mockCheckingAccountId,
          contractId: mockContractId,
          accountPayableId: mockAccountPayable,
          accountReceivableId: undefined
        })
        expect(mockMappings.financialMovementMapping).toHaveReturnedWith(mocks.mockParsedOmieFinancialMovement)
        expect(mockRepositories.financialMovements.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockParsedOmieFinancialMovement], ['companyId', 'externalId', 'movementId'])
      })

      it('Should receive financialMovements from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getFinancialMovements.mockResolvedValue([{ ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [{}] }])
        await sut(mockPayload)
      })

      it('Should call omieMappings.financialMovement successfully with accountReceivable instead of accountPayable', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockRepositories, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountReceivableId } = makeSut()
        mockRepositories.accountsPayable.findMany.mockResolvedValue([])
        mockRepositories.accountsReceivable.findMany.mockResolvedValue(mocks.mockSavedOmieAccountsReceivable)
        mockMappings.financialMovementMapping.mockReturnValueOnce({ ...mocks.mockParsedOmieFinancialMovement, accountPayableId: null, accountReceivableId: mockAccountReceivableId })
        await sut(mockPayload)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mocks.mockOmieFinancialMovementsResponse.movimentos[0],
          omieFinancialMovementDepartment: mocks.mockOmieFinancialMovementsResponse.movimentos[0].departamentos[0],
          omieFinancialMovementCategory: mocks.mockOmieFinancialMovementsResponse.movimentos[0].categorias[0],
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          checkingAccountId: mockCheckingAccountId,
          contractId: mockContractId,
          accountPayableId: undefined,
          accountReceivableId: mockAccountReceivableId
        })
        expect(mockMappings.financialMovementMapping).toHaveReturnedWith({ ...mocks.mockParsedOmieFinancialMovement, accountPayableId: null, accountReceivableId: mockAccountReceivableId })
      })

      it('Should call omieMappings.financialMovement successfully without categories list: use static category in title details', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieService, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], categorias: [] }
        mockOmieService.getFinancialMovements.mockResolvedValue([mockOmieFinancialMovement])
        await sut(mockPayload)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mockOmieFinancialMovement,
          omieFinancialMovementDepartment: mocks.mockOmieFinancialMovementsResponse.movimentos[0].departamentos[0],
          omieFinancialMovementCategory: { cCodCateg: mocks.mockOmieFinancialMovementsResponse.movimentos[0].detalhes.cCodCateg },
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          checkingAccountId: mockCheckingAccountId,
          contractId: mockContractId,
          accountPayableId: mockAccountPayable,
          accountReceivableId: undefined
        })
        expect(mockMappings.financialMovementMapping).toHaveReturnedWith(mocks.mockParsedOmieFinancialMovement)
      })

      it('Should call omieMappings.financialMovement successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [], categorias: [], detalhes: { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0].detalhes, nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined } }
        mockOmieService.getFinancialMovements.mockResolvedValue([mockOmieFinancialMovement])
        await sut(mockPayload)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mockOmieFinancialMovement,
          omieFinancialMovementDepartment: {},
          omieFinancialMovementCategory: { cCodCateg: undefined },
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: undefined,
          billing: undefined,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          categoryId: undefined,
          checkingAccountId: undefined,
          contractId: undefined,
          accountPayableId: undefined,
          accountReceivableId: undefined
        })
        expect(mockMappings.financialMovementMapping).toHaveReturnedWith(mocks.mockParsedOmieFinancialMovement)
      })
    })
  })

  it('Should return success with custom parameters', async () => {
    const { sut, mockPayload, mockLogger, mockOmieService, mockSQS } = makeSut()
    mockPayload.startDate = '2022-01-01'
    mockPayload.endDate = '2022-01-31'
    const result = await sut(mockPayload)
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
    expect(mockOmieService.getBanks).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getCnae).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getDocumentTypes).toHaveBeenCalledTimes(1)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockPayload.companyId)
    expect(result).toEqual({ success: true })
  })

  it('Should return success without custom parameters', async () => {
    const { sut, mockPayload, mockLogger, mockOmieService, mockSQS } = makeSut()
    const result = await sut(mockPayload)
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
    expect(mockOmieService.getBanks).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getCnae).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getDocumentTypes).toHaveBeenCalledTimes(1)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockPayload.companyId)
    expect(result).toEqual({ success: true })
  })
})
