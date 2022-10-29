const config = require('../../../../src/config')
const makeUseCase = require('../../../../src/v1/ingestionPerformer/useCase')
const { NotFoundError, ValidationError } = require('../../../../src/common/errors')
const mocks = require('../../../mocks')

jest.useFakeTimers('modern').setSystemTime(new Date())

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

  const mockOmieMappings = {
    /** dimensions */
    company: jest.fn(() => mocks.mockParsedOmieCompany),
    category: jest.fn(() => mocks.mockParsedOmieCategory),
    department: jest.fn(() => mocks.mockParsedOmieDepartment),
    project: jest.fn(() => mocks.mockParsedOmieProject),
    product: jest.fn(() => mocks.mockParsedOmieProduct),
    service: jest.fn(() => mocks.mockParsedOmieService),
    customer: jest.fn(() => mocks.mockParsedOmieCustomer),
    checkingAccount: jest.fn(() => mocks.mockParsedOmieCheckingAccount),
    contract: jest.fn(() => mocks.mockParsedOmieContract),
    productOrder: jest.fn(() => mocks.mockParsedOmieProductOrder),
    serviceOrder: jest.fn(() => mocks.mockParsedOmieServiceOrder),
    /** facts */
    productInvoice: jest.fn(() => mocks.mockParsedOmieProductInvoice),
    serviceInvoice: jest.fn(() => mocks.mockParsedOmieServiceInvoice),
    title: jest.fn().mockReturnValueOnce(mocks.mockParsedOmieAccountPayable).mockReturnValueOnce(mocks.mockParsedOmieAccountReceivable),
    financialMovement: jest.fn(() => mocks.mockParsedOmieFinancialMovement)
  }

  const mockRepositories = {
    /** dimensions */
    companies: {
      findOne: jest.fn(async () => mocks.mockSavedOmieCompanies[0]),
      createOrUpdateOne: jest.fn(async () => null)
    },
    categories: {
      find: jest.fn(async () => mocks.mockSavedOmieCategories),
      createOrUpdateMany: jest.fn(async () => null)
    },
    departments: {
      find: jest.fn(async () => mocks.mockSavedOmieDepartments),
      createOrUpdateMany: jest.fn(async () => null)
    },
    projects: {
      find: jest.fn(async () => mocks.mockSavedOmieProjects),
      createOrUpdateMany: jest.fn(async () => null)
    },
    customers: {
      find: jest.fn(async () => mocks.mockSavedOmieCustomers),
      createOrUpdateMany: jest.fn(async () => null)
    },
    productsServices: {
      find: jest.fn(async () => [...mocks.mockSavedOmieProducts, ...mocks.mockSavedOmieServices]),
      createOrUpdateMany: jest.fn(async () => null)
    },
    checkingAccounts: {
      find: jest.fn(async () => mocks.mockSavedOmieCheckingAccounts),
      createOrUpdateMany: jest.fn(async () => null)
    },
    contracts: {
      find: jest.fn(async () => mocks.mockSavedOmieContracts),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    orders: {
      find: jest.fn(async () => [...mocks.mockSavedOmieProductOrders, ...mocks.mockSavedOmieServiceOrders]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    /** facts */
    billing: {
      find: jest.fn(async () => [...mocks.mockSavedOmieProductInvoices, ...mocks.mockSavedOmieServiceInvoices]),
      deleteOldAndCreateNew: jest.fn(async () => null)
    },
    accountsPayable: {
      find: jest.fn(async () => mocks.mockSavedOmieAccountsPayable),
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

  const mockLogger = {
    info: jest.fn(() => null),
    error: jest.fn(() => null)
  }

  const mockQueuer = {
    sendCompanyToDataExportQueue: jest.fn(async () => 'https://the-queuer-url/data.json')
  }

  const useCase = makeUseCase({
    omieService: mockOmieService,
    omieMappings: mockOmieMappings,
    repositories: mockRepositories,
    logger: mockLogger,
    queuer: mockQueuer
  })

  return {
    sut: useCase,
    mockPayload,
    mockCompanyId,
    mockCredentials,
    mockOmieService,
    mockOmieMappings,
    mockRepositories,
    mockLogger,
    mockQueuer,
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

describe('ingestionPerformer UseCase', () => {
  it('Should not find company and throws a NotFoundError', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockRepositories } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockPayload.companyId = 'any-invalid-or-non-existing-id'
    mockRepositories.companies.findOne.mockResolvedValueOnce(null)
    try {
      await sut({ payload: mockPayload })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundError)
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe(`Company ${mockPayload.companyId} not found`)
    }
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ _id: mockPayload.companyId })
    expect(spySut).toReturnTimes(0)
  })

  it('Should find company but throws a ValidationError', async () => {
    const sutPackage = makeSut()
    const { sut, mockPayload, mockRepositories } = sutPackage
    const spySut = jest.spyOn(sutPackage, 'sut')
    mockRepositories.companies.findOne.mockResolvedValueOnce({ ...mocks.mockSavedOmieCompanies[0], isActive: false })
    try {
      await sut({ payload: mockPayload })
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationError)
      expect(error.statusCode).toBe(422)
      expect(error.message).toBe(`Company ${mockPayload.companyId} is not active`)
    }
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ _id: mockPayload.companyId })
    expect(spySut).toReturnTimes(0)
  })

  it('Should call repositories.companies.findOne successfully', async () => {
    const { sut, mockPayload, mockRepositories } = makeSut()
    await sut({ payload: mockPayload })
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ _id: mockPayload.companyId })
  })

  describe('getAuxiliaryRecords', () => {
    it('Should call omieService methods successfully', async () => {
      const { sut, mockPayload, mockOmieService } = makeSut()
      await sut({ payload: mockPayload })
      expect(mockOmieService.getBanks).toHaveBeenCalledTimes(1)
      expect(mockOmieService.getCnae).toHaveBeenCalledTimes(1)
      expect(mockOmieService.getDocumentTypes).toHaveBeenCalledTimes(1)
    })
  })

  describe('updateCompany', () => {
    it('Should updated company successfully', async () => {
      const { sut, mockPayload, mockOmieService, mockCredentials, mockOmieMappings, mockCompanyId, mockRepositories } = makeSut()
      await sut({ payload: mockPayload })
      expect(mockOmieService.getCompany).toHaveBeenCalledTimes(1)
      expect(mockOmieMappings.company).toHaveBeenCalledWith({ omieCompany: mocks.mockOmieCompaniesResponse.empresas_cadastro[0], omieCnae: mocks.mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
      expect(mockRepositories.companies.createOrUpdateOne).toHaveBeenCalledWith({ _id: mockCompanyId }, mocks.mockParsedOmieCompany)
    })
    it('Should updated company with inactive record successfully', async () => {
      const { sut, mockPayload, mockOmieService, mockCredentials, mockOmieMappings, mockCompanyId, mockRepositories } = makeSut()
      const mockOmieCompanyResponse = { ...mocks.mockOmieCompaniesResponse.empresas_cadastro[0], inativa: 'S' }
      mockOmieService.getCompany.mockResolvedValueOnce(mockOmieCompanyResponse)
      mockOmieMappings.company.mockReturnValueOnce({ ...mocks.mockParsedOmieCompany, isActive: false })
      await sut({ payload: mockPayload })
      expect(mockOmieService.getCompany).toHaveBeenCalledTimes(1)
      expect(mockOmieMappings.company).toHaveBeenCalledWith({ omieCompany: mockOmieCompanyResponse, omieCnae: mocks.mockOmieCnaeResponse.cadastros, credentials: mockCredentials })
      expect(mockRepositories.companies.createOrUpdateOne).toHaveBeenCalledWith({ _id: mockCompanyId }, {
        ...mocks.mockParsedOmieCompany,
        isActive: false,
        statusAt: new Date(),
        statusBy: config.app.user
      })
    })
  })

  describe('updateDimensions', () => {
    describe('updateCategories', () => {
      it('Should update categories successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getCategories).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.category).toHaveBeenCalledWith({ omieCategory: mocks.mockOmieCategoriesResponse.categoria_cadastro[0], companyId: mockCompanyId })
        expect(mockOmieMappings.category).toHaveReturnedWith(mocks.mockParsedOmieCategory)
        expect(mockRepositories.categories.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.mockParsedOmieCategory, mocks.mockEmptyCategory])
      })
    })

    describe('updateDepartments', () => {
      it('Should update departments successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getDepartments).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.department).toHaveBeenCalledWith({ omieDepartment: mocks.mockOmieDepartmentsResponse.departamentos[0], companyId: mockCompanyId })
        expect(mockOmieMappings.department).toHaveReturnedWith(mocks.mockParsedOmieDepartment)
        expect(mockRepositories.departments.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.mockParsedOmieDepartment, mocks.mockEmptyDepartment])
      })
    })

    describe('updateProjects', () => {
      it('Should update projects successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getProjects).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.project).toHaveBeenCalledWith({ omieProject: mocks.mockOmieProjectsResponse.cadastro[0], companyId: mockCompanyId })
        expect(mockOmieMappings.project).toHaveReturnedWith(mocks.mockParsedOmieProject)
        expect(mockRepositories.projects.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.mockParsedOmieProject, mocks.mockEmptyProject])
      })
    })

    describe('updateCustomers', () => {
      it('Should update customers successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getCustomers).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getActivities).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.customer).toHaveBeenCalledWith({ omieCustomer: mocks.mockOmieCustomersResponse.clientes_cadastro[0], omieActivities: mocks.mockOmieActivitiesResponse.lista_tipos_atividade, omieBanks: mocks.mockOmieBanksResponse.fin_banco_cadastro, omieCnae: mocks.mockOmieCnaeResponse.cadastros, companyId: mockCompanyId })
        expect(mockOmieMappings.customer).toHaveReturnedWith(mocks.mockParsedOmieCustomer)
        expect(mockRepositories.customers.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.mockParsedOmieCustomer, mocks.mockEmptyCustomer])
      })
    })

    describe('updateProductsServices', () => {
      it('Should update productsServices successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getProducts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServices).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.product).toHaveBeenCalledWith({ omieProduct: mocks.mockOmieProductsResponse.produto_servico_cadastro[0], companyId: mockCompanyId })
        expect(mockOmieMappings.product).toHaveReturnedWith(mocks.mockParsedOmieProduct)
        expect(mockOmieMappings.service).toHaveBeenCalledWith({ omieService: mocks.mockOmieServicesResponse.cadastros[0], companyId: mockCompanyId })
        expect(mockOmieMappings.service).toHaveReturnedWith(mocks.mockParsedOmieService)
        expect(mockRepositories.productsServices.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.mockParsedOmieProduct, mocks.mockParsedOmieService, mocks.mockEmptyProductService])
      })
    })

    describe('updateCheckingAccounts', () => {
      it('Should update checking accounts successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getCheckingAccounts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getCheckingAccountTypes).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.checkingAccount).toHaveBeenCalledWith({ omieCheckingAccount: mocks.mockOmieCheckingAccountsResponse.ListarContasCorrentes[0], omieBanks: mocks.mockOmieBanksResponse.fin_banco_cadastro, omieCheckingAccountTypes: mocks.mockOmieCheckingAccountTypesResponse.cadastros, companyId: mockCompanyId })
        expect(mockOmieMappings.checkingAccount).toHaveReturnedWith(mocks.mockParsedOmieCheckingAccount)
        expect(mockRepositories.checkingAccounts.createOrUpdateMany).toHaveBeenCalledWith(['companyId', 'externalId'], [mocks.mockParsedOmieCheckingAccount, mocks.mockEmptyCheckingAccount])
      })
    })

    describe('updateContracts', () => {
      it('Should update contracts successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockServiceId, mockCategoryId, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getContracts).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getContractSteps).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getContractBillingTypes).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.contract).toHaveBeenCalledWith({
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
          categoryId: mockCategoryId,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.contract).toHaveReturnedWith(mocks.mockParsedOmieContract)
        expect(mockRepositories.contracts.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.mockParsedOmieContract, mocks.mockEmptyContract])
      })

      it('Should receive contracts from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getContracts.mockResolvedValueOnce([{ ...mocks.mockOmieContractsResponse.contratoCadastro[0], departamentos: [{}] }])
        await sut({ payload: mockPayload })
      })

      it('Should call omieMappings.contract successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService } = makeSut()
        const mockOmieContract = { ...mocks.mockOmieContractsResponse.contratoCadastro[0], departamentos: [], cabecalho: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].cabecalho, nCodCli: undefined }, infAdic: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].infAdic, nCodProj: undefined }, itensContrato: [{ ...mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0], itemCabecalho: { ...mocks.mockOmieContractsResponse.contratoCadastro[0].itensContrato[0].itemCabecalho, codServico: undefined, cCodCategItem: undefined } }] }
        mockOmieService.getContracts.mockResolvedValueOnce([mockOmieContract])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.contract).toHaveBeenCalledWith({
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
          categoryId: undefined,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.contract).toHaveReturnedWith(mocks.mockParsedOmieContract)
      })
    })

    describe('updateOrders', () => {
      it('Should update orders successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockProductId, mockServiceId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getProductOrders).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServiceOrders).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getBillingSteps).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.productOrder).toHaveBeenCalledWith({
          omieOrder: mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0],
          omieOrderDepartment: mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].departamentos[0],
          omieOrderItem: mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: mockCategoryId,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.productOrder).toHaveReturnedWith(mocks.mockParsedOmieProductOrder)
        expect(mockOmieMappings.serviceOrder).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.serviceOrder).toHaveReturnedWith(mocks.mockParsedOmieServiceOrder)
        expect(mockRepositories.orders.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.mockParsedOmieProductOrder, mocks.mockParsedOmieServiceOrder, mocks.mockEmptyOrder])
      })

      it('Should receive orders from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getProductOrders.mockResolvedValueOnce([{ ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0], departamentos: [{}] }])
        mockOmieService.getServiceOrders.mockResolvedValueOnce([{ ...mocks.mockOmieServiceOrdersResponse.osCadastro[0], Departamentos: [{}] }])
        await sut({ payload: mockPayload })
      })

      it('Should call omieMappings.serviceOrder and not call omieMappings.productOrder', async () => {
        const { sut, mockPayload, mockOmieMappings, mockOmieService } = makeSut()
        mockOmieService.getProductOrders.mockResolvedValueOnce([])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.serviceOrder).toHaveBeenCalled()
        expect(mockOmieMappings.productOrder).toHaveBeenCalledTimes(0)
      })

      it('Should call omieMappings.productOrder and omieMappings.serviceOrder successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService } = makeSut()

        const mockOmieProductOrder = { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0], departamentos: [], cabecalho: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].cabecalho, codigo_cliente: undefined }, informacoes_adicionais: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].informacoes_adicionais, codProj: undefined }, det: [{ ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0], inf_adic: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0].inf_adic, codigo_categoria_item: undefined }, produto: { ...mocks.mockOmieProductOrdersResponse.pedido_venda_produto[0].det[0].inf_adic.produto, codigo_produto: undefined } }] }
        mockOmieService.getProductOrders.mockResolvedValueOnce([mockOmieProductOrder])
        const mockOmieServiceOrder = { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0], Departamentos: [], Cabecalho: { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].Cabecalho, nCodCli: undefined }, InformacoesAdicionais: { ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].InformacoesAdicionais, nCodProj: undefined, cNumContrato: undefined }, ServicosPrestados: [{ ...mocks.mockOmieServiceOrdersResponse.osCadastro[0].ServicosPrestados[0], cCodCategItem: undefined, nCodServico: undefined }] }
        mockOmieService.getServiceOrders.mockResolvedValueOnce([mockOmieServiceOrder])

        await sut({ payload: mockPayload })

        expect(mockOmieMappings.productOrder).toHaveBeenCalledWith({
          omieOrder: mockOmieProductOrder,
          omieOrderDepartment: {},
          omieOrderItem: mockOmieProductOrder.det[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          productServiceId: undefined,
          categoryId: undefined,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.productOrder).toHaveReturnedWith(mocks.mockParsedOmieProductOrder)

        expect(mockOmieMappings.serviceOrder).toHaveBeenCalledWith({
          omieOrder: mockOmieServiceOrder,
          omieOrderDepartment: {},
          omieOrderItem: mockOmieServiceOrder.ServicosPrestados[0],
          omieBillingSteps: mocks.mockOmieBillingStepsResponse.cadastros,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          serviceServiceId: undefined,
          categoryId: undefined,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.serviceOrder).toHaveReturnedWith(mocks.mockParsedOmieServiceOrder)
      })
    })
  })

  describe('updateFacts', () => {
    describe('updateBilling', () => {
      it('Should update billing successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockProductId, mockServiceId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getProductInvoices).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getServiceInvoices).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.productInvoice).toHaveBeenCalledWith({
          omieInvoice: mocks.mockOmieProductInvoicesResponse.nfCadastro[0],
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: mocks.mockSavedOmieProductOrders[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: mockCategoryId,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.productInvoice).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)
        expect(mockOmieMappings.serviceInvoice).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.serviceInvoice).toHaveReturnedWith(mocks.mockParsedOmieServiceInvoice)
        expect(mockRepositories.billing.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'type'], [mocks.mockParsedOmieProductInvoice, mocks.mockParsedOmieServiceInvoice, mocks.mockEmptyBilling])
      })

      it('Should receive billing from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getProductInvoices.mockResolvedValueOnce([{ ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], pedido: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido, Departamentos: [{}] } }])
        mockOmieService.getServiceInvoices.mockResolvedValueOnce([{ ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0], OrdemServico: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].OrdemServico, Departamentos: [{}] } }])
        await sut({ payload: mockPayload })
      })

      it('Should call omieMappings.serviceOrder and not call omieMappings.serviceInvoice', async () => {
        const { sut, mockPayload, mockOmieMappings, mockOmieService } = makeSut()
        mockOmieService.getProductInvoices.mockResolvedValueOnce([])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.serviceInvoice).toHaveBeenCalled()
        expect(mockOmieMappings.productInvoice).toHaveBeenCalledTimes(0)
      })

      it('Should call omieMappings.productInvoice successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService } = makeSut()

        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], pedido: { Departamentos: [] }, nfDestInt: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].nfDestInt, nCodCli: undefined }, compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: undefined }, det: [{ ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0], nfProdInt: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0].nfProdInt, nCodProd: undefined } }] }
        mockOmieService.getProductInvoices.mockResolvedValueOnce([mockOmieProductInvoice])
        const mockOmieServiceInvoice = { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0], OrdemServico: { Departamentos: [], nCodigoContrato: undefined, nCodigoOS: undefined }, Cabecalho: { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].Cabecalho, nCodigoCliente: undefined }, ListaServicos: [{ ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].ListaServicos[0], CodigoServico: undefined }], Adicionais: { ...mocks.mockOmieServiceInvoicesResponse.nfseEncontradas[0].Adicionais, nCodigoProjeto: undefined } }
        mockOmieService.getServiceInvoices.mockResolvedValueOnce([mockOmieServiceInvoice])

        await sut({ payload: mockPayload })

        expect(mockOmieMappings.productInvoice).toHaveBeenCalledWith({
          omieInvoice: mockOmieProductInvoice,
          omieInvoiceDepartment: {},
          omieInvoiceItem: mockOmieProductInvoice.det[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: undefined,
          projectId: undefined,
          departmentId: undefined,
          productServiceId: undefined,
          categoryId: undefined,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.productInvoice).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)

        expect(mockOmieMappings.serviceInvoice).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: undefined
        })
        expect(mockOmieMappings.serviceInvoice).toHaveReturnedWith(mocks.mockParsedOmieServiceInvoice)
      })

      it('Should call omieMappings.productInvoice successfully without order: undefined', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService, mockCustomerId, mockDepartmentId, mockProductId } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: undefined } }
        mockOmieService.getProductInvoices.mockResolvedValueOnce([mockOmieProductInvoice])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.productInvoice).toHaveBeenCalledWith({
          omieInvoice: mockOmieProductInvoice,
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: undefined,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: undefined,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.productInvoice).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)
      })

      it('Should call omieMappings.productInvoice successfully without order: 0', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService, mockCustomerId, mockDepartmentId, mockProductId } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: '0' } }
        mockOmieService.getProductInvoices.mockResolvedValueOnce([mockOmieProductInvoice])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.productInvoice).toHaveBeenCalledWith({
          omieInvoice: mockOmieProductInvoice,
          omieInvoiceDepartment: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].pedido.Departamentos[0],
          omieInvoiceItem: mocks.mockOmieProductInvoicesResponse.nfCadastro[0].det[0],
          order: undefined,
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: undefined,
          departmentId: mockDepartmentId,
          productServiceId: mockProductId,
          categoryId: undefined,
          emptyRecordsIds: mocks.mockEmptyRecordsIds
        })
        expect(mockOmieMappings.productInvoice).toHaveReturnedWith(mocks.mockParsedOmieProductInvoice)
      })

      it('Should not call omieMappings.productInvoice due to no matched order', async () => {
        const { sut, mockPayload, mockOmieMappings, mockOmieService } = makeSut()
        const mockOmieProductInvoice = { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0], compl: { ...mocks.mockOmieProductInvoicesResponse.nfCadastro[0].compl, nIdPedido: 123456 } }
        mockOmieService.getProductInvoices.mockResolvedValueOnce([mockOmieProductInvoice])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.productInvoice).toHaveBeenCalledTimes(0)
      })
    })

    describe('updateAccountsPayable', () => {
      it('Should update accounts payable successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getAccountsPayable).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
        expect(mockRepositories.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'titleId'], [mocks.mockParsedOmieAccountPayable, mocks.mockEmptyAccountPayable])
      })

      it('Should receive accountsPayable from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getAccountsPayable.mockResolvedValueOnce([{ ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], departamentos: [{}] }])
        await sut({ payload: mockPayload })
      })

      it('Should call omieMappings.title without title entries', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], lancamentos: undefined }
        mockOmieService.getAccountsPayable.mockResolvedValueOnce([mockOmieAccountPayable])
        await sut({ payload: mockPayload })
        expect(mockOmieService.getAccountsPayable).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
        expect(mockRepositories.accountsPayable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'titleId'], [mocks.mockParsedOmieAccountPayable, mocks.mockEmptyAccountPayable])
      })

      it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], cabecTitulo: { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
        mockOmieService.getAccountsPayable.mockResolvedValueOnce([mockOmieAccountPayable])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
      })

      it('Should call omieMappings.title successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService } = makeSut()
        const mockOmieAccountPayable = { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.mockOmieAccountsPayableResponse.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
        mockOmieService.getAccountsPayable.mockResolvedValueOnce([mockOmieAccountPayable])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: undefined
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(1, mocks.mockParsedOmieAccountPayable)
      })
    })

    describe('updateAccountsReceivable', () => {
      it('Should update accounts receivable successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getAccountsReceivable).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
        expect(mockRepositories.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'titleId'], [mocks.mockParsedOmieAccountReceivable, mocks.mockEmptyAccountReceivable])
      })

      it('Should call omieMappings.title without title entries', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId, mockRepositories } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], lancamentos: undefined }
        mockOmieService.getAccountsReceivable.mockResolvedValueOnce([mockOmieAccountReceivable])
        await sut({ payload: mockPayload })
        expect(mockOmieService.getAccountsReceivable).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
        expect(mockRepositories.accountsReceivable.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'titleId'], [mocks.mockParsedOmieAccountReceivable, mocks.mockEmptyAccountReceivable])
      })

      it('Should receive accountsReceivable from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getAccountsReceivable.mockResolvedValueOnce([{ ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], departamentos: [{}] }])
        await sut({ payload: mockPayload })
      })

      it('Should call omieMappings.title without categories list: use fixed category in title details', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockContractId } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], cabecTitulo: { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [] } }
        mockOmieService.getAccountsReceivable.mockResolvedValueOnce([mockOmieAccountReceivable])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
      })

      it('Should call omieMappings.title successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService } = makeSut()
        const mockOmieAccountReceivable = { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0], departamentos: [], cabecTitulo: { ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].cabecTitulo, aCodCateg: [], nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined }, lancamentos: [{ ...mocks.mockOmieAccountsReceivableResponse.titulosEncontrados[0].lancamentos[0], nCodCC: undefined }] }
        mockOmieService.getAccountsReceivable.mockResolvedValueOnce([mockOmieAccountReceivable])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.title).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: undefined
        })
        expect(mockOmieMappings.title).toHaveNthReturnedWith(2, mocks.mockParsedOmieAccountReceivable)
      })
    })

    describe('updateFinancialMovements', () => {
      it('Should update successfully', async () => {
        const { sut, mockPayload, mockOmieService, mockCompanyId, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable, mockRepositories } = makeSut()
        await sut({ payload: mockPayload })
        expect(mockOmieService.getEntryOrigins).toHaveBeenCalledTimes(1)
        expect(mockOmieService.getFinancialMovements).toHaveBeenCalledTimes(1)
        expect(mockOmieMappings.financialMovement).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId,
          accountPayableId: mockAccountPayable,
          accountReceivableId: undefined
        })
        expect(mockOmieMappings.financialMovement).toHaveReturnedWith(mocks.mockParsedOmieFinancialMovement)
        expect(mockRepositories.financialMovements.deleteOldAndCreateNew).toHaveBeenCalledWith(['companyId', 'customerId', 'externalId', 'movementId'], [mocks.mockParsedOmieFinancialMovement, mocks.mockEmptyFinancialMovement])
      })

      it('Should receive financialMovements from Omie with departments array but missing department id', async () => {
        const { sut, mockPayload, mockOmieService } = makeSut()
        mockOmieService.getFinancialMovements.mockResolvedValueOnce([{ ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [{}] }])
        await sut({ payload: mockPayload })
      })

      it('Should call omieMappings.financialMovement successfully with accountReceivable instead of accountPayable', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockRepositories, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountReceivableId } = makeSut()
        mockRepositories.accountsPayable.find.mockResolvedValueOnce([])
        mockRepositories.accountsReceivable.find.mockResolvedValueOnce(mocks.mockSavedOmieAccountsReceivable)
        mockOmieMappings.financialMovement.mockReturnValueOnce({ ...mocks.mockParsedOmieFinancialMovement, accountPayableId: null, accountReceivableId: mockAccountReceivableId })
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.financialMovement).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId,
          accountPayableId: undefined,
          accountReceivableId: mockAccountReceivableId
        })
        expect(mockOmieMappings.financialMovement).toHaveReturnedWith({ ...mocks.mockParsedOmieFinancialMovement, accountPayableId: null, accountReceivableId: mockAccountReceivableId })
      })

      it('Should call omieMappings.financialMovement successfully without departments', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieService, mockOmieMappings, mockCustomerId, mockProjectId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [] }
        mockOmieService.getFinancialMovements.mockResolvedValueOnce([mockOmieFinancialMovement])
        mockOmieMappings.financialMovement.mockReturnValueOnce({ ...mocks.mockParsedOmieFinancialMovement, departmentId: mocks.mockEmptyRecordsIds.department })
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.financialMovement).toHaveBeenCalledWith({
          omieFinancialMovement: mockOmieFinancialMovement,
          omieFinancialMovementDepartment: {},
          omieFinancialMovementCategory: mocks.mockOmieFinancialMovementsResponse.movimentos[0].categorias[0],
          omieEntryOrigins: mocks.mockOmieEntryOriginsResponse.origem,
          omieDocumentTypes: mocks.mockOmieDocumentTypesResponse.tipo_documento_cadastro,
          order: mocks.mockSavedOmieServiceOrders[0],
          billing: mocks.mockSavedOmieServiceInvoices[0],
          companyId: mockCompanyId,
          customerId: mockCustomerId,
          projectId: mockProjectId,
          departmentId: undefined,
          categoryId: mockCategoryId,
          checkingAccountId: mockCheckingAccountId,
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId,
          accountPayableId: mockAccountPayable,
          accountReceivableId: undefined
        })
        expect(mockOmieMappings.financialMovement).toHaveReturnedWith({ ...mocks.mockParsedOmieFinancialMovement, departmentId: mocks.mockEmptyRecordsIds.department })
      })

      it('Should call omieMappings.financialMovement successfully without categories list: use fixed category in title details', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieService, mockOmieMappings, mockCustomerId, mockProjectId, mockDepartmentId, mockCategoryId, mockCheckingAccountId, mockContractId, mockAccountPayable } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], categorias: [] }
        mockOmieService.getFinancialMovements.mockResolvedValueOnce([mockOmieFinancialMovement])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.financialMovement).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: mockContractId,
          accountPayableId: mockAccountPayable,
          accountReceivableId: undefined
        })
        expect(mockOmieMappings.financialMovement).toHaveReturnedWith(mocks.mockParsedOmieFinancialMovement)
      })

      it('Should call omieMappings.financialMovement successfully without relationships', async () => {
        const { sut, mockPayload, mockCompanyId, mockOmieMappings, mockOmieService } = makeSut()
        const mockOmieFinancialMovement = { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0], departamentos: [], categorias: [], detalhes: { ...mocks.mockOmieFinancialMovementsResponse.movimentos[0].detalhes, nCodCliente: undefined, cCodProjeto: undefined, nCodCC: undefined, nCodCtr: undefined, nCodOS: undefined, nCodNF: undefined, nCodTitulo: undefined, cCodCateg: undefined } }
        mockOmieService.getFinancialMovements.mockResolvedValueOnce([mockOmieFinancialMovement])
        await sut({ payload: mockPayload })
        expect(mockOmieMappings.financialMovement).toHaveBeenCalledWith({
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
          emptyRecordsIds: mocks.mockEmptyRecordsIds,
          contractId: undefined,
          accountPayableId: undefined,
          accountReceivableId: undefined
        })
        expect(mockOmieMappings.financialMovement).toHaveReturnedWith(mocks.mockParsedOmieFinancialMovement)
      })
    })
  })

  it('Should call logger.info successfully', async () => {
    const { sut, mockPayload, mockLogger } = makeSut()
    await sut({ payload: mockPayload })
    expect(mockLogger.info).toHaveBeenCalledTimes(3)
  })

  it('Should call queuer.sendCompanyToDataExportQueue successfully', async () => {
    const { sut, mockPayload, mockQueuer } = makeSut()
    await sut({ payload: mockPayload })
    expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockPayload.companyId)
  })

  it('Should return success', async () => {
    const { sut, mockPayload } = makeSut()
    const result = await sut({ payload: mockPayload })
    expect(result).toEqual({ success: true })
  })
})
