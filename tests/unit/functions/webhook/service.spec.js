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

  const mockRepositories = {
    companies: {
      findOne: jest.fn(async () => mockCompany)
    },
    contracts: {
      find: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    orders: {
      find: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    accountsPayable: {
      find: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    accountsReceivable: {
      find: jest.fn(async () => []),
      deleteMany: jest.fn(async () => ({}))
    },
    financialMovements: {
      deleteMany: jest.fn(async () => ({}))
    }
  }

  const mockLogger = {
    info: jest.fn(() => null)
  }

  const mockQueuer = {
    sendCompanyToDataExportQueue: jest.fn(async () => null)
  }

  const service = makeService({
    Repositories: () => mockRepositories,
    logger: mockLogger,
    queuer: mockQueuer
  })

  return {
    sut: service,
    mockPayload,
    mockRepositories,
    mockLogger,
    mockCompany,
    mockQueuer
  }
}

describe('webhook service', () => {
  it('Should receive a ping payload and finish process early', async () => {
    const { sut, mockRepositories, mockLogger, mockQueuer } = makeSut()
    const mockPayload = { ping: 'Omie' }
    const result = await sut(mockPayload)
    expect(mockRepositories.companies.findOne).toHaveBeenCalledTimes(0)
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      ping: 'Omie',
      pong: 'Omie Harbor'
    })
  })

  it('Should not find company and throw an NotFoundException', async () => {
    const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer } = makeSut()
    mockRepositories.companies.findOne.mockResolvedValueOnce(null)
    try {
      await sut(mockPayload)
      expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ 'credentials.appKey': mockPayload.appKey })
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException)
      expect(error.statusCode).toBe(404)
      expect(error.message).toBe(`Company related to appKey '${mockPayload.appKey}' not found`)
    }
    expect(mockLogger.info).toHaveBeenCalledTimes(0)
    expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
  })

  it('Should not find action', async () => {
    const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()
    const result = await sut(mockPayload)
    expect(mockRepositories.companies.findOne).toHaveBeenCalledWith({ 'credentials.appKey': mockPayload.appKey })
    expect(mockLogger.info).toHaveBeenCalledTimes(1)
    expect(mockLogger.info).toHaveBeenCalledWith(
      `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
      { result, payload: mockPayload }
    )
    expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
    expect(result).toEqual({
      message: 'Unknown action: Entity.event'
    })
  })

  describe('OrdemServico.Excluida action', () => {
    it('Should follow deleteOrder flow due to OrdemServico.Excluida and does not find orders', async () => {
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'OrdemServico.Excluida'
      mockPayload.event = { idOrdemServico: '00000000' }
      mockRepositories.orders.find.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '00000000'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'OrdemServico.Excluida'
      mockPayload.event = { idOrdemServico: '618754178' }
      mockRepositories.orders.find.mockResolvedValueOnce(mockSavedOmieServiceOrders)
      mockRepositories.orders.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '618754178'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        _id: [mockSavedOmieServiceOrders[0]._id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        orderId: [mockSavedOmieServiceOrders[0]._id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        orderId: [mockSavedOmieServiceOrders[0]._id]
      })
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany._id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany._id} - ${mockCompany.name} sent to dataExport process`
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'VendaProduto.Excluida'
      mockPayload.event = { idPedido: '00000000' }
      mockRepositories.orders.find.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '00000000'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'VendaProduto.Excluida'
      mockPayload.event = { idPedido: '915642742' }
      mockRepositories.orders.find.mockResolvedValueOnce(mockSavedOmieProductOrders)
      mockRepositories.orders.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.orders.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '915642742'
      })
      expect(mockRepositories.orders.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        _id: [mockSavedOmieProductOrders[0]._id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        orderId: [mockSavedOmieProductOrders[0]._id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        orderId: [mockSavedOmieProductOrders[0]._id]
      })
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany._id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany._id} - ${mockCompany.name} sent to dataExport process`
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'ContratoServico.Excluido'
      mockPayload.event = { nCodCtr: '00000000' }
      mockRepositories.contracts.find.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.contracts.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '00000000'
      })
      expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'ContratoServico.Excluido'
      mockPayload.event = { nCodCtr: '617704532' }
      mockRepositories.contracts.find.mockResolvedValueOnce(mockSavedOmieContracts)
      mockRepositories.contracts.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.contracts.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '617704532'
      })
      expect(mockRepositories.contracts.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        _id: [mockSavedOmieContracts[0]._id]
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        contractId: [mockSavedOmieContracts[0]._id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        contractId: [mockSavedOmieContracts[0]._id]
      })
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany._id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany._id} - ${mockCompany.name} sent to dataExport process`
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaPagar.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '00000000' }
      mockRepositories.accountsPayable.find.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsPayable.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '00000000'
      })
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaPagar.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '618738728' }
      mockRepositories.accountsPayable.find.mockResolvedValueOnce(mockSavedOmieAccountsPayable)
      mockRepositories.accountsPayable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsPayable.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '618738728'
      })
      expect(mockRepositories.accountsPayable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        _id: [mockSavedOmieAccountsPayable[0]._id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        accountPayableId: [mockSavedOmieAccountsPayable[0]._id]
      })
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany._id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany._id} - ${mockCompany.name} sent to dataExport process`
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaReceber.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '00000000' }
      mockRepositories.accountsReceivable.find.mockResolvedValueOnce([])

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsReceivable.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '00000000'
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledTimes(0)
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledTimes(0)
      expect(mockLogger.info).toHaveBeenCalledTimes(1)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaReceber.Excluido'
      mockPayload.event = { codigo_lancamento_omie: '618738728' }
      mockRepositories.accountsReceivable.find.mockResolvedValueOnce(mockSavedOmieAccountsReceivable)
      mockRepositories.accountsReceivable.deleteMany.mockResolvedValueOnce(1)
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.accountsReceivable.find).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '618738728'
      })
      expect(mockRepositories.accountsReceivable.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        _id: [mockSavedOmieAccountsReceivable[0]._id]
      })
      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        accountReceivableId: [mockSavedOmieAccountsReceivable[0]._id]
      })
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany._id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany._id} - ${mockCompany.name} sent to dataExport process`
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
      const { sut, mockPayload, mockRepositories, mockLogger, mockQueuer, mockCompany } = makeSut()

      mockPayload.topic = 'Financas.ContaCorrente.Lancamento.Excluido'
      mockPayload.event = { nCodLanc: '617704532' }
      mockRepositories.financialMovements.deleteMany.mockResolvedValueOnce(1)

      const result = await sut(mockPayload)

      expect(mockRepositories.financialMovements.deleteMany).toHaveBeenCalledWith({
        companyId: mockCompany._id,
        externalId: '617704532'
      })
      expect(mockQueuer.sendCompanyToDataExportQueue).toHaveBeenCalledWith(mockCompany._id)
      expect(mockLogger.info).toHaveBeenCalledTimes(2)
      expect(mockLogger.info).toHaveBeenNthCalledWith(1,
        `Action for company ${mockCompany._id} - ${mockCompany.name}: ${mockPayload.topic}`,
        { result, payload: mockPayload }
      )
      expect(mockLogger.info).toHaveBeenNthCalledWith(2,
        `Company ${mockCompany._id} - ${mockCompany.name} sent to dataExport process`
      )
      expect(result).toEqual({
        deleted: {
          financialMovements: 1
        }
      })
    })
  })
})
