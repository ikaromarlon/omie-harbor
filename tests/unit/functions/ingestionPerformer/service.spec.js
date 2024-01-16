const makeService = require('../../../../src/functions/ingestionPerformer/service')
const { NotFoundException, UnprocessableEntityException } = require('../../../../src/common/errors')
const mocks = require('../../../mocks')

const makeSut = () => {
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const payload = { companyId: mockCompanyId }
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
    companyMapping: jest.fn(() => mocks.mockCompany),
    /** dimensions */
    categoryMapping: jest.fn(() => mocks.mockCategory),
    departmentMapping: jest.fn(() => mocks.mockDepartment),
    projectMapping: jest.fn(() => mocks.mockProject),
    productMapping: jest.fn(() => mocks.mockProduct),
    serviceMapping: jest.fn(() => mocks.mockService),
    customerMapping: jest.fn(() => mocks.mockCustomer),
    checkingAccountMapping: jest.fn(() => mocks.mockCheckingAccount),
    contractMapping: jest.fn(() => mocks.mockContract),
    productOrderMapping: jest.fn(() => mocks.mockProductOrder),
    serviceOrderMapping: jest.fn(() => mocks.mockServiceOrder),
    /** facts */
    productInvoiceMapping: jest.fn(() => mocks.mockProductInvoice),
    serviceInvoiceMapping: jest.fn(() => mocks.mockServiceInvoice),
    titleMapping: jest.fn().mockReturnValueOnce(mocks.mockAccountPayable).mockReturnValueOnce(mocks.mockAccountReceivable),
    financialMovementMapping: jest.fn(() => mocks.mockFinancialMovement)
  }

  const mockCompanyRepository = {
    findById: jest.fn(async () => mocks.mockCompany),
    update: jest.fn(async () => null)
  }

  const mockRepositories = {
    /** dimensions */
    categories: {
      findMany: jest.fn(async () => [mocks.mockCategory]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    departments: {
      findMany: jest.fn(async () => [mocks.mockDepartment]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    projects: {
      findMany: jest.fn(async () => [mocks.mockProject]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    customers: {
      findMany: jest.fn(async () => [mocks.mockCustomer]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    productsServices: {
      findMany: jest.fn(async () => [mocks.mockProduct, mocks.mockService]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    checkingAccounts: {
      findMany: jest.fn(async () => [mocks.mockCheckingAccount]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    contracts: {
      findMany: jest.fn(async () => [mocks.mockContract]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    orders: {
      findMany: jest.fn(async () => [mocks.mockProductOrder, mocks.mockServiceOrder]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    /** facts */
    billing: {
      findMany: jest.fn(async () => [mocks.mockProductInvoice, mocks.mockServiceInvoice]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsPayable: {
      findMany: jest.fn(async () => [mocks.mockAccountPayable]),
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
    companiesRepository: mockCompanyRepository,
    repositories: mockRepositories,
    logger: mockLogger,
    sqs: mockSQS
  })

  return {
    sut: service,
    payload,
    mockCompanyId,
    mockCredentials,
    mockOmieService,
    mockMappings,
    mockCompanyRepository,
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

describe('ingestionPerformer - service', () => {
  it('Should not find company and throws a NotFoundException', async () => {
    const sutPackage = makeSut()
    const { sut, payload, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    payload.companyId = 'any-invalid-or-non-existing-id'
    mockCompanyRepository.findById.mockResolvedValue(null)
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe(`Company ${payload.companyId} not found`)
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.companyId)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should find company but throws a UnprocessableEntityException', async () => {
    const sutPackage = makeSut()
    const { sut, payload, mockCompanyRepository } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockCompanyRepository.findById.mockResolvedValue({ ...mocks.mockCompany, isActive: false })
    try {
      await sut(payload)
    } catch (error) {
      expect(error).toBeInstanceOf(UnprocessableEntityException)
      expect(error.message).toBe(`Company ${payload.companyId} is not active`)
    }
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.companyId)
    expect(spySut).toHaveReturnedTimes(0)
  })

  it('Should call companiesRepository.findById successfully', async () => {
    const { sut, payload, mockCompanyRepository } = makeSut()
    await sut(payload)
    expect(mockCompanyRepository.findById).toHaveBeenCalledWith(payload.companyId)
  })

  describe('updateCompany', () => {
    it('Should updated company successfully', async () => {
      const { sut, payload, mockOmieService, mockCredentials, mockMappings, mockCompanyId, mockCompanyRepository } = makeSut()
      await sut(payload)
      expect(mockOmieService.getCompany).toHaveBeenCalledTimes(1)
      expect(mockMappings.companyMapping).toHaveBeenCalledWith({ omieCompany: mocks.mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mocks.mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
      expect(mockCompanyRepository.update).toHaveBeenCalledWith({ id: mockCompanyId, ...mocks.mockCompany })
    })

    it('Should updated company with inactive record successfully', async () => {
      const { sut, payload, mockOmieService, mockCredentials, mockMappings, mockCompanyId, mockCompanyRepository } = makeSut()
      const mockOmieCompanyResponse = { ...mocks.mockOmieCompaniesResponse.empresas_cadastro[0], inativa: 'S' }
      mockOmieService.getCompany.mockResolvedValue(mockOmieCompanyResponse)
      mockMappings.companyMapping.mockReturnValueOnce({ ...mocks.mockCompany, isActive: false })
      await sut(payload)
      expect(mockOmieService.getCompany).toHaveBeenCalledTimes(1)
      expect(mockMappings.companyMapping).toHaveBeenCalledWith({ omieCompany: mockOmieCompanyResponse, omieCnae: mocks.mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
      expect(mockCompanyRepository.update).toHaveBeenCalledWith({ id: mockCompanyId, ...mocks.mockCompany, isActive: false })
    })
  })

  describe('updateDimensions', () => {
    describe('updateCategories', () => {
      it('Should update categories successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getCategories).toHaveBeenCalledTimes(1)
        expect(mockMappings.categoryMapping).toHaveBeenCalledWith({ omieCategory: mocks.mockOmieCategoriesResponse.categoria_cadastro[0], companyId: mockCompanyId })
        expect(mockRepositories.categories.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockCategory], ['companyId', 'externalId'])
      })
    })

    describe('updateDepartments', () => {
      it('Should update departments successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getDepartments).toHaveBeenCalledTimes(1)
        expect(mockMappings.departmentMapping).toHaveBeenCalledWith({ omieDepartment: mocks.mockOmieDepartmentsResponse.departamentos[0], companyId: mockCompanyId })
        expect(mockRepositories.departments.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockDepartment], ['companyId', 'externalId'])
      })
    })

    describe('updateProjects', () => {
      it('Should update projects successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getProjects).toHaveBeenCalledTimes(1)
        expect(mockMappings.projectMapping).toHaveBeenCalledWith({ omieProject: mocks.mockOmieProjectsResponse.cadastro[0], companyId: mockCompanyId })
        expect(mockRepositories.projects.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockProject], ['companyId', 'externalId'])
      })
    })

    describe('updateCustomers', () => {
      it('Should update customers successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getCustomers).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getActivities).toHaveBeenCalledTimes(1)
        expect(mockMappings.customerMapping).toHaveBeenCalledWith({ omieCustomer: mocks.mockOmieCustomersResponse.clientes_cadastro[0], omieActivities: mocks.mockOmieActivitiesResponse.lista_tipos_atividade, omieBanks: mocks.mockOmieBanksResponse.fin_banco_cadastro, omieCnae: mocks.mockOmieCnaeResponse.cadastros, companyId: mockCompanyId })
        expect(mockRepositories.customers.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockCustomer], ['companyId', 'externalId'])
      })
    })

    describe('updateProductsServices', () => {
      it('Should update productsServices successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getProducts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServices).toHaveBeenCalledTimes(2)
        expect(mockMappings.productMapping).toHaveBeenCalledWith({ omieProduct: mocks.mockOmieProductsResponse.produto_servico_cadastro[0], companyId: mockCompanyId })
        expect(mockMappings.serviceMapping).toHaveBeenCalledWith({ omieService: mocks.mockOmieServicesResponse.cadastros[0], companyId: mockCompanyId })
        expect(mockRepositories.productsServices.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockProduct, mocks.mockService], ['companyId', 'externalId'])
      })
    })

    describe('updateCheckingAccounts', () => {
      it('Should update checking accounts successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getCheckingAccounts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getCheckingAccountTypes).toHaveBeenCalledTimes(1)
        expect(mockMappings.checkingAccountMapping).toHaveBeenCalledWith({ omieCheckingAccount: mocks.mockOmieCheckingAccountsResponse.ListarContasCorrentes[0], omieBanks: mocks.mockOmieBanksResponse.fin_banco_cadastro, omieCheckingAccountTypes: mocks.mockOmieCheckingAccountTypesResponse.cadastros, companyId: mockCompanyId })
        expect(mockRepositories.checkingAccounts.createOrUpdateMany).toHaveBeenCalledWith([mocks.mockCheckingAccount], ['companyId', 'externalId'])
      })
    })

    describe('updateContracts', () => {
      it('Should update contracts successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockServiceId, mockCategoryId, mockRepositories } = makeSut()
        await sut(payload)
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
        expect(mockRepositories.contracts.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockContract], ['companyId', 'externalId', 'type'])
      })

      it('Should receive contracts from Omie with departments array but missing department id', async () => {
        const { sut, payload, mockOmieService } = makeSut()
        mockOmieService.getContracts.mockResolvedValue([{ ...mocks.mockOmieContractsResponse.contratoCadastro[0], departamentos: [{}] }])
        await sut(payload)
      })

      it('Should call omieMappings.contract successfully without relationships', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieContract = { ...mocks.mockOmieContractsResponse.contratoCadastro[0], departamentos: [], cabecalho: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].cabecalho, nCodCli: undefined }, infAdic: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].infAdic, nCodProj: undefined }, itensContrato: [{ ...mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0], itemCabecalho: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0].itemCabecalho, codServico: undefined, cCodCategItem: undefined } }] }
        mockOmieService.getContracts.mockResolvedValue([mockOmieContract])
        await sut(payload)
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
      })
    })

    describe('updateOrders', () => {
      it('Should update orders successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockProductId, mockServiceId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(payload)
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
        expect(mockRepositories.orders.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockProductOrder, mocks.mockServiceOrder], ['companyId', 'externalId', 'type'])
      })

      it('Should receive orders from Omie with departments array but missing department id', async () => {
        const { sut, payload, mockOmieService } = makeSut()
        mockOmieService.getProductOrders.mockResolvedValue([{ ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0], departamentos: [{}] }])
        mockOmieService.getServiceOrders.mockResolvedValue([{ ...mocks.mockOmieServiceOrdersResponse.osCadastro[0], Departamentos: [{}] }])
        await sut(payload)
      })

      it('Should call omieMappings.serviceOrder and not call omieMappings.productOrder', async () => {
        const { sut, payload, mockMappings, mockOmieService } = makeSut()
        mockOmieService.getProductOrders.mockResolvedValue([])
        await sut(payload)
        expect(mockMappings.serviceOrderMapping).toHaveBeenCalled()
        expect(mockMappings.productOrderMapping).toHaveBeenCalledTimes(0)
      })

      it('Should call omieMappings.productOrder and omieMappings.serviceOrder successfully without relationships', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService } = makeSut()

        const mockOmieProductOrder = { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0], departamentos: [], cabecalho: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].cabecalho, codigo_cliente: undefined }, informacoes_adicionais: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].informacoes_adicionais, codProj: undefined }, det: [{ ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0], inf_adic: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0].inf_adic, codigo_categoria_item: undefined }, produto: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0].inf_adic.produto, codigo_produto: undefined } }] }
        mockOmieService.getProductOrders.mockResolvedValue([mockOmieProductOrder])
        const mockOmieServiceOrder = { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0], Departamentos: [], Cabecalho: { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].Cabecalho, nCodCli: undefined }, InformacoesAdicionais: { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].InformacoesAdicionais, nCodProj: undefined, cNumContrato: undefined }, ServicosPrestados: [{ ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].ServicosPrestados[0], cCodCategItem: undefined, nCodServico: undefined }] }
        mockOmieService.getServiceOrders.mockResolvedValue([mockOmieServiceOrder])

        await sut(payload)

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
      })
    })
  })

  describe('updateFacts', () => {
    describe('updateBilling', () => {
      it('Should update billing successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockProductId, mockServiceId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getProductInvoices).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServiceInvoices).toHaveBeenCalledTimes(1)
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mocks.mockOmieProductInvoicesResponse.nfCadastro[0],
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: mocks.mockProductOrder,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: mockCategoryId
        })
        expect(mockMappings.serviceInvoiceMapping).toHaveBeenCalledWith({
          omieInvoice: mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0],
          omieInvoiceDepartment: mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].OrdemServico.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].ListaServicos[0],
          order: mocks.mockServiceOrder,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockServiceId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockRepositories.billing.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockProductInvoice, mocks.mockServiceInvoice], ['companyId', 'externalId', 'type'])
      })

      it('Should receive billing from Omie with departments array but missing department id', async () => {
        const { sut, payload, mockOmieService } = makeSut()
        mockOmieService.getProductInvoices.mockResolvedValue([{ ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], pedido: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido, Departamentos: [{}] } }])
        mockOmieService.getServiceInvoices.mockResolvedValue([{ ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0], OrdemServico: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].OrdemServico, Departamentos: [{}] } }])
        await sut(payload)
      })

      it('Should call omieMappings.serviceOrder and not call omieMappings.serviceInvoice', async () => {
        const { sut, payload, mockMappings, mockOmieService } = makeSut()
        mockOmieService.getProductInvoices.mockResolvedValue([])
        await sut(payload)
        expect(mockMappings.serviceInvoiceMapping).toHaveBeenCalled()
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledTimes(0)
      })

      it('Should call omieMappings.productInvoice successfully without relationships', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService } = makeSut()

        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], pedido: { Departamentos: [] }, nfDestInt: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].nfDestInt, nCodCli: undefined }, compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: undefined }, det: [{ ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0], nfProdInt: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0].nfProdInt, nCodProd: undefined } }] }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        const mockOmieServiceInvoice = { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0], OrdemServico: { Departamentos: [], nCodigoContrato: undefined, nCodigoOS: undefined }, Cabecalho: { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].Cabecalho, nCodigoCliente: undefined }, ListaServicos: [{ ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].ListaServicos[0], CodigoServico: undefined }], Adicionais: { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].Adicionais, nCodigoProjeto: undefined } }
        mockOmieService.getServiceInvoices.mockResolvedValue([mockOmieServiceInvoice])

        await sut(payload)

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
      })

      it('Should call omieMappings.productInvoice successfully without order: undefined', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockDepartmentId, mockProductId } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: undefined } }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        await sut(payload)
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
      })

      it('Should call omieMappings.productInvoice successfully without order: 0', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockDepartmentId, mockProductId } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: '0' } }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        await sut(payload)
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
      })

      it('Should not call omieMappings.productInvoice due to no matched order', async () => {
        const { sut, payload, mockMappings, mockOmieService } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: 123456 } }
        mockOmieService.getProductInvoices.mockResolvedValue([mockOmieProductInvoice])
        await sut(payload)
        expect(mockMappings.productInvoiceMapping).toHaveBeenCalledTimes(0)
      })
    })

    describe('updateAccountsPayable', () => {
      it('Should update accounts payable successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getAccountsPayable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0],
          omieTitleDepartment: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo.aCodCateg[0],
          omieTitleEntries: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockAccountPayable)
        expect(mockRepositories.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockAccountPayable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should receive accountsPayable from Omie with departments array but missing department id', async () => {
        const { sut, payload, mockOmieService } = makeSut()
        mockOmieService.getAccountsPayable.mockResolvedValue([{ ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], departamentos: [{}] }])
        await sut(payload)
      })

      it('Should call omieMappings.title without title entries', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], lancamentos: undefined }
        mockOmieService.getAccountsPayable.mockResolvedValue([mockOmieAccountPayable])
        await sut(payload)
        expect(mockOmieService.getAccountsPayable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountPayable,
          omieTitleDepartment: mockOmieAccountPayable.departamentos[0],
          omieTitleCategory: mockOmieAccountPayable.cabecTitulo.aCodCateg[0],
          omieTitleEntries: [],
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockAccountPayable)
        expect(mockRepositories.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockAccountPayable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], cabecTitulo: { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
        mockOmieService.getAccountsPayable.mockResolvedValue([mockOmieAccountPayable])
        await sut(payload)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountPayable,
          omieTitleDepartment: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: { cCodCateg: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo.cCodCateg },
          omieTitleEntries: mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockAccountPayable)
      })

      it('Should call omieMappings.title successfully without relationships', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
        mockOmieService.getAccountsPayable.mockResolvedValue([mockOmieAccountPayable])
        await sut(payload)
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
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(1, mocks.mockAccountPayable)
      })
    })

    describe('updateAccountsReceivable', () => {
      it('Should update accounts receivable successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getAccountsReceivable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0],
          omieTitleDepartment: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo.aCodCateg[0],
          omieTitleEntries: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockAccountReceivable)
        expect(mockRepositories.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockAccountReceivable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should call omieMappings.title without title entries', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], lancamentos: undefined }
        mockOmieService.getAccountsReceivable.mockResolvedValue([mockOmieAccountReceivable])
        await sut(payload)
        expect(mockOmieService.getAccountsReceivable).toHaveBeenCalledTimes(2)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountReceivable,
          omieTitleDepartment: mockOmieAccountReceivable.departamentos[0],
          omieTitleCategory: mockOmieAccountReceivable.cabecTitulo.aCodCateg[0],
          omieTitleEntries: [],
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockAccountReceivable)
        expect(mockRepositories.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockAccountReceivable], ['companyId', 'externalId', 'titleId'])
      })

      it('Should receive accountsReceivable from Omie with departments array but missing department id', async () => {
        const { sut, payload, mockOmieService } = makeSut()
        mockOmieService.getAccountsReceivable.mockResolvedValue([{ ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], departamentos: [{}] }])
        await sut(payload)
      })

      it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], cabecTitulo: { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
        mockOmieService.getAccountsReceivable.mockResolvedValue([mockOmieAccountReceivable])
        await sut(payload)
        expect(mockMappings.titleMapping).toHaveBeenCalledWith({
          omieTitle: mockOmieAccountReceivable,
          omieTitleDepartment: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].departamentos[0],
          omieTitleCategory: { cCodCateg: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo.cCodCateg },
          omieTitleEntries: mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          categoryId: mockCategoryId,
          contractId: mockContractId
        })
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockAccountReceivable)
      })

      it('Should call omieMappings.title successfully without relationships', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
        mockOmieService.getAccountsReceivable.mockResolvedValue([mockOmieAccountReceivable])
        await sut(payload)
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
        expect(mockMappings.titleMapping).toHaveNthReturnedWith(2, mocks.mockAccountReceivable)
      })
    })

    describe('updateFinancialMovements', () => {
      it('Should update successfully', async () => {
        const { sut, payload, mockOmieService, mockCompanyId, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable, mockRepositories } = makeSut()
        await sut(payload)
        expect(mockOmieService.getEntryOrigins).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getFinancialMovements).toHaveBeenCalledTimes(2)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mocks.mockOmieFinancialMovementsResponse.movimentos[0],
          omieFinancialMovementDepartment: mocks.mockOmieFinancialMovementsResponse.movimentos[0].departamentos[0],
          omieFinancialMovementCategory: mocks.mockOmieFinancialMovementsResponse.movimentos[0].categorias[0],
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
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
        expect(mockRepositories.financialMovements.deleteOldAndCreateNew).toHaveBeenCalledWith([mocks.mockFinancialMovement], ['companyId', 'externalId', 'movementId'])
      })

      it('Should receive financialMovements from Omie with departments array but missing department id', async () => {
        const { sut, payload, mockOmieService } = makeSut()
        mockOmieService.getFinancialMovements.mockResolvedValue([{ ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [{}] }])
        await sut(payload)
      })

      it('Should call omieMappings.financialMovement successfully with accountReceivable instead of accountPayable', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockRepositories, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountReceivableId } = makeSut()
        mockRepositories.accountsPayable.findMany.mockResolvedValue([])
        mockRepositories.accountsReceivable.findMany.mockResolvedValue([mocks.mockAccountReceivable])
        mockMappings.financialMovementMapping.mockReturnValueOnce({ ...mocks.mockFinancialMovement, accountPayableId: null, accountReceivableId: mockAccountReceivableId })
        await sut(payload)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mocks.mockOmieFinancialMovementsResponse.movimentos[0],
          omieFinancialMovementDepartment: mocks.mockOmieFinancialMovementsResponse.movimentos[0].departamentos[0],
          omieFinancialMovementCategory: mocks.mockOmieFinancialMovementsResponse.movimentos[0].categorias[0],
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
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
      })

      it('Should call omieMappings.financialMovement successfully without categories list: use static category in title details', async () => {
        const { sut, payload, mockCompanyId, mockOmieService, mockMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], categorias: [] }
        mockOmieService.getFinancialMovements.mockResolvedValue([mockOmieFinancialMovement])
        await sut(payload)
        expect(mockMappings.financialMovementMapping).toHaveBeenCalledWith({
          omieFinancialMovement: mockOmieFinancialMovement,
          omieFinancialMovementDepartment: mocks.mockOmieFinancialMovementsResponse.movimentos[0].departamentos[0],
          omieFinancialMovementCategory: { cCodCateg: mocks.mockOmieFinancialMovementsResponse.movimentos[0].detalhes.cCodCateg },
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockServiceOrder,
          billing: mocks.mockServiceInvoice,
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
      })

      it('Should call omieMappings.financialMovement successfully without relationships', async () => {
        const { sut, payload, mockCompanyId, mockMappings, mockOmieService } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [], categorias: [], detalhes: { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0].detalhes, nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined } }
        mockOmieService.getFinancialMovements.mockResolvedValue([mockOmieFinancialMovement])
        await sut(payload)
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
      })
    })
  })

  it('Should return success with custom parameters', async () => {
    const { sut, payload, mockLogger, mockOmieService, mockSQS } = makeSut()
    payload.startDate = '2022-01-01'
    payload.endDate = '2022-01-31'
    const result = await sut(payload)
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
    expect(mockOmieService.getBanks).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getCnae).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getDocumentTypes).toHaveBeenCalledTimes(1)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(payload.companyId)
    expect(result).toEqual({ success: true })
  })

  it('Should return success without custom parameters', async () => {
    const { sut, payload, mockLogger, mockOmieService, mockSQS } = makeSut()
    const result = await sut(payload)
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
    expect(mockOmieService.getBanks).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getCnae).toHaveBeenCalledTimes(1)
    expect(mockOmieService.getDocumentTypes).toHaveBeenCalledTimes(1)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(payload.companyId)
    expect(result).toEqual({ success: true })
  })
})
