jest.mock('../../../../src/config', () => ({
  app: {
    name: 'Omie Harbor'
  }
}))

const { NotFoundException } = require('../../../../src/common/errors')
const makeService = require('../../../../src/functions/webhook/service')
const {
  mockSavedOmieCompanies,
  mockSavedOmieServiceOrders,
  mockSavedOmieProductOrders,
  mockSavedOmieContracts,
  mockSavedOmieAccountsPayable,
  mockSavedOmieAccountsReceivable
} = require('../../../mocks')

const makeSut = () => {
  const mockCompany = mockSavedOmieCompanies[0]

  const mockPayload = {
    topic: 'Entity.event',
    event: {},
    appKey: 'the-app-key'
  }

  const mockCompanyRepository = {
    findByAppKey: jest.fn(async () => mockCompany)
  }

  const mockRepositories = {
    contracts: {
      findMany: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    orders: {
      findMany: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    accountsPayable: {
      findMany: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    accountsReceivable: {
      findMany: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    financialMovements: {
      deleteMany: jest.fn(async () => ({}))
    }
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const mockSQS = {
    sendCompanyToDataExportQueue: jest.fn(async () => null)
  }

  const service = makeService({
    companiesRepository: mockCompanyRepository,
    repositories: mockRepositories,
    logger: mockLogger,
    sqs: mockSQS
  })

  return {
    sut: service,
    mockPayload,
    mockCompanyRepository,
    mockRepositories,
    mockLogger,
    mockCompany,
    mockSQS
  }
}

describe('webhook service', () => {
  it('Should receive a ping payload and finish process early', async () => {
    const { sut, mockCompanyRepository, mockLogger, mockSQS } = makeSut()
    const mockPayload = { ping: 'Omie' }
    const result = await sut(mockPayload)
    expect(mockCompanyRepository.findByAppKey).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      ping: 'Omie',
      pong: 'Omie Harbor'
    })
  })

  it('Should not find company and throw an NotFoundException', async () => {
    const { sut, mockPayload, mockCompanyRepository, mockLogger, mockSQS } = makeSut()
    mockCompanyRepository.findByAppKey.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
      expect(mockCompanyRepository.findByAppKey).toHaveBeenCalledWith(mockPayload.appKey)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe(`Company related to appKey '${mockPayload.appKey}' not found`)
    }
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
  })

  it('Should not find action', async () => {
    const { sut, mockPayload, mockCompanyRepository, mockLogger, mockSQS, mockCompany } = makeSut()
    const result = await sut(mockPayload)
    expect(mockCompanyRepository.findByAppKey).toHaveBeenCalledWith(mockPayload.appKey)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(mockLogger.info).toHaveBeenCalledWith(
      `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
      { result, payload: mockPayload }
    )
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      message: 'Unknown action: Entity.event'
    })
  })

  describe('OrdemServico.Excluida action', () => {
    it('Should follow deleteOrder flow due to OrdemServico.Excluida and does not find orders', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'OrdemServico.Excluida'
      mockPayload.event = { idOrdemServico: '00000000' }
      mockRepositories.orders.findMany.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(result).toEqual({
        deleted: {
          orders: 0,
          accountsReceivable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteOrder flow due to OrdemServico.Excluida action and delete records', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'OrdemServico.Excluida'
      mockPayload.event = { idOrdemServico: '618754178' }
      mockRepositories.orders.findMany.mockResolvedValueOnce(mockSavedOmieServiceOrders)
      mockRepositories.orders.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '618754178'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockSavedOmieServiceOrders[0].id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockSavedOmieServiceOrders[0].id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockSavedOmieServiceOrders[0].id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany.id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          orders: 1,
          accountsReceivable: 1,
          financialMovements: 1
        }
      })
    })
  })

  describe('VendaProduto.Excluida action', () => {
    it('Should follow deleteOrder flow due to VendaProduto.Excluida and does not find orders', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'VendaProduto.Excluida'
      mockPayload.event = { idPedido: '00000000' }
      mockRepositories.orders.findMany.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(result).toEqual({
        deleted: {
          orders: 0,
          accountsReceivable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteOrder flow due to VendaProduto.Excluida action and delete records', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'VendaProduto.Excluida'
      mockPayload.event = { idPedido: '915642742' }
      mockRepositories.orders.findMany.mockResolvedValueOnce(mockSavedOmieProductOrders)
      mockRepositories.orders.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '915642742'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockSavedOmieProductOrders[0].id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockSavedOmieProductOrders[0].id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockSavedOmieProductOrders[0].id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany.id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          orders: 1,
          accountsReceivable: 1,
          financialMovements: 1
        }
      })
    })
  })

  describe('ContratoServico.Excluido action', () => {
    it('Should follow deleteContract flow due to ContratoServico.Excluido and does not find contracts', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'ContratoServico.Excluido'
      mockPayload.event = { nCodCtr: '00000000' }
      mockRepositories.contracts.findMany.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.contracts.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(result).toEqual({
        deleted: {
          contracts: 0,
          accountsReceivable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteContract flow due to ContratoServico.Excluido action and delete records', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'ContratoServico.Excluido'
      mockPayload.event = { nCodCtr: '617704532' }
      mockRepositories.contracts.findMany.mockResolvedValueOnce(mockSavedOmieContracts)
      mockRepositories.contracts.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.contracts.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '617704532'
      })
      expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockSavedOmieContracts[0].id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        contractId: [mockSavedOmieContracts[0].id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        contractId: [mockSavedOmieContracts[0].id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany.id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          contracts: 1,
          accountsReceivable: 1,
          financialMovements: 1
        }
      })
    })
  })

  describe('Financas.ContaPagar.Excluido action', () => {
    it('Should follow deleteAccountPayable flow due to Financas.ContaPagar.Excluido and does not find accountsPayable', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaPagar.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '00000000' }
      mockRepositories.accountsPayable.findMany.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsPayable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(result).toEqual({
        deleted: {
          accountsPayable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteAccountPayable flow due to Financas.ContaPagar.Excluido action and delete records', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaPagar.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '618738728' }
      mockRepositories.accountsPayable.findMany.mockResolvedValueOnce(mockSavedOmieAccountsPayable)
      mockRepositories.accountsPayable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsPayable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '618738728'
      })
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockSavedOmieAccountsPayable[0].id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        accountPayableId: [mockSavedOmieAccountsPayable[0].id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany.id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          accountsPayable: 1,
          financialMovements: 1
        }
      })
    })
  })

  describe('Financas.ContaReceber.Excluido action', () => {
    it('Should follow deleteAccountReceivable flow due to Financas.ContaReceber.Excluido and does not find accountsReceivable', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaReceber.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '00000000' }
      mockRepositories.accountsReceivable.findMany.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsReceivable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(result).toEqual({
        deleted: {
          accountsReceivable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteAccountReceivable flow due to Financas.ContaReceber.Excluido action and delete records', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaReceber.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '618738728' }
      mockRepositories.accountsReceivable.findMany.mockResolvedValueOnce(mockSavedOmieAccountsReceivable)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsReceivable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '618738728'
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockSavedOmieAccountsReceivable[0].id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        accountReceivableId: [mockSavedOmieAccountsReceivable[0].id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany.id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          accountsReceivable: 1,
          financialMovements: 1
        }
      })
    })
  })

  describe('Financas.ContaCorrente.Lancamento.Excluido action', () => {
    it('Should follow deleteFinancialMovement flow due to Financas.ContaCorrente.Lancamento.Excluido action and delete records', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaCorrente.Lancamento.Excluido'
      mockPayload.event = { nCodLanc: '617704532' }
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '617704532'
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany.id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          financialMovements: 1
        }
      })
    })
  })
})
