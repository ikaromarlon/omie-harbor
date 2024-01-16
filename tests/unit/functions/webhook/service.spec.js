jest.mock('../../../../src/config', () => ({
  app: {
    name: 'Omie Harbor'
  }
}))

const { NotFoundException } = require('../../../../src/common/errors')
const makeService = require('../../../../src/functions/webhook/service')
const {
  mockCompany,
  mockServiceOrder,
  mockProductOrder,
  mockContract,
  mockAccountPayable,
  mockAccountReceivable
} = require('../../../mocks')

const makeSut = () => {
  const payload = {
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
    payload,
    mockCompanyRepository,
    mockRepositories,
    mockLogger,
    mockCompany,
    mockSQS
  }
}

describe('webhook - service', () => {
  it('Should receive a ping payload and finish process early', async () => {
    const { sut, mockCompanyRepository, mockLogger, mockSQS } = makeSut()
    const payload = { ping: 'Omie' }
    const result = await sut(payload)
    expect(mockCompanyRepository.findByAppKey).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      ping: 'Omie',
      pong: 'Omie Harbor'
    })
  })

  it('Should not find company and throw an NotFoundException', async () => {
    const { sut, payload, mockCompanyRepository, mockLogger, mockSQS } = makeSut()
    mockCompanyRepository.findByAppKey.mockResolvedValueOnce(null)
    try {
      await sut(payload)
      expect(mockCompanyRepository.findByAppKey).toHaveBeenCalledWith(payload.appKey)
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.message).toBe(`Company related to appKey '${payload.appKey}' not found`)
    }
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
  })

  it('Should not find action', async () => {
    const { sut, payload, mockCompanyRepository, mockLogger, mockSQS, mockCompany } = makeSut()
    const result = await sut(payload)
    expect(mockCompanyRepository.findByAppKey).toHaveBeenCalledWith(payload.appKey)
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(mockLogger.info).toHaveBeenCalledWith(
      `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
      { result, payload }
    )
    expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      message: 'Unknown action: Entity.event'
    })
  })

  describe('OrdemServico.Excluida action', () => {
    it('Should follow deleteOrder flow due to OrdemServico.Excluida and does not find orders', async () => {
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'OrdemServico.Excluida'
      payload.event = { idOrdemServico: '00000000' }
      mockRepositories.orders.findMany.mockResolvedValueOnce([])

      const result = await sut(payload)

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
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'OrdemServico.Excluida'
      payload.event = { idOrdemServico: '618754178' }
      mockRepositories.orders.findMany.mockResolvedValueOnce([mockServiceOrder])
      mockRepositories.orders.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(payload)

      expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '618754178'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockServiceOrder.id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockServiceOrder.id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockServiceOrder.id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'VendaProduto.Excluida'
      payload.event = { idPedido: '00000000' }
      mockRepositories.orders.findMany.mockResolvedValueOnce([])

      const result = await sut(payload)

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
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'VendaProduto.Excluida'
      payload.event = { idPedido: '915642742' }
      mockRepositories.orders.findMany.mockResolvedValueOnce([mockProductOrder])
      mockRepositories.orders.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(payload)

      expect(mockRepositories.orders.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '915642742'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockProductOrder.id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockProductOrder.id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        orderId: [mockProductOrder.id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'ContratoServico.Excluido'
      payload.event = { nCodCtr: '00000000' }
      mockRepositories.contracts.findMany.mockResolvedValueOnce([])

      const result = await sut(payload)

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
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'ContratoServico.Excluido'
      payload.event = { nCodCtr: '617704532' }
      mockRepositories.contracts.findMany.mockResolvedValueOnce([mockContract])
      mockRepositories.contracts.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(payload)

      expect(mockRepositories.contracts.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '617704532'
      })
      expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockContract.id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        contractId: [mockContract.id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        contractId: [mockContract.id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'Financas.ContaPagar.Excluido'
      payload.event = { codigo_lancamento_omie: '00000000' }
      mockRepositories.accountsPayable.findMany.mockResolvedValueOnce([])

      const result = await sut(payload)

      expect(mockRepositories.accountsPayable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
      )
      expect(result).toEqual({
        deleted: {
          accountsPayable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteAccountPayable flow due to Financas.ContaPagar.Excluido action and delete records', async () => {
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'Financas.ContaPagar.Excluido'
      payload.event = { codigo_lancamento_omie: '618738728' }
      mockRepositories.accountsPayable.findMany.mockResolvedValueOnce([mockAccountPayable])
      mockRepositories.accountsPayable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(payload)

      expect(mockRepositories.accountsPayable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '618738728'
      })
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockAccountPayable.id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        accountPayableId: [mockAccountPayable.id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'Financas.ContaReceber.Excluido'
      payload.event = { codigo_lancamento_omie: '00000000' }
      mockRepositories.accountsReceivable.findMany.mockResolvedValueOnce([])

      const result = await sut(payload)

      expect(mockRepositories.accountsReceivable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '00000000'
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
      )
      expect(result).toEqual({
        deleted: {
          accountsReceivable: 0,
          financialMovements: 0
        }
      })
    })

    it('Should follow deleteAccountReceivable flow due to Financas.ContaReceber.Excluido action and delete records', async () => {
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'Financas.ContaReceber.Excluido'
      payload.event = { codigo_lancamento_omie: '618738728' }
      mockRepositories.accountsReceivable.findMany.mockResolvedValueOnce([mockAccountReceivable])
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(payload)

      expect(mockRepositories.accountsReceivable.findMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '618738728'
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        id: [mockAccountReceivable.id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        accountReceivableId: [mockAccountReceivable.id]
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
      const { sut, payload, mockRepositories, mockLogger, mockSQS, mockCompany } = makeSut()

      payload.topic = 'Financas.ContaCorrente.Lancamento.Excluido'
      payload.event = { nCodLanc: '617704532' }
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(payload)

      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany.id,
        externalId: '617704532'
      })
      expect(mockSQS.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany.id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany.id} - ${mockCompany.name}: ${payload.topic}`,
        { result, payload }
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
