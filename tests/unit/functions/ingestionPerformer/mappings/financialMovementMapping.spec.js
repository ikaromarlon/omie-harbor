const titleMapping = require('../../../../../src/functions/ingestionPerformer/mappings/financialMovementMapping')
const {
  mockEmptyRecordsIds,
  mockOmieFinancialMovementsResponse,
  mockParsedOmieFinancialMovement,
  mockOmieDocumentTypesResponse,
  mockOmieEntryOriginsResponse
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieFinancialMovement = mockOmieFinancialMovementsResponse.movimentos[0]
  const mockOmieDocumentTypes = mockOmieDocumentTypesResponse.tipo_documento_cadastro
  const mockOmieEntryOrigins = mockOmieEntryOriginsResponse.origem
  const mockOrder = { id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15' }
  const mockBilling = { id: '7be89715-63e6-426a-a952-ae19b700a28f', type: 'NFS-e' }
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const mockCheckingAccountId = 'e5e74170-40ee-42d9-9741-6d708200e306'
  const mockContractId = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'
  const mockAccountPayable = '2f9671a0-1b1e-4e45-8f59-b76f10af37e1'
  const mockAccountReceivableId = null

  return {
    sut: titleMapping,
    mockOmieFinancialMovement,
    mockOmieDocumentTypes,
    mockOmieEntryOrigins,
    mockOrder,
    mockBilling,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockCategoryId,
    mockCheckingAccountId,
    mockContractId,
    mockAccountPayable,
    mockAccountReceivableId
  }
}

describe('FinancialMovement Mapping', () => {
  it('Should return mapped financial movement successfully', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: mockOmieFinancialMovement,
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual(mockParsedOmieFinancialMovement)
  })

  it('Should return mapped financial movement successfully with movement ids and missing title ids', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: { ...mockOmieFinancialMovement, detalhes: { ...mockOmieFinancialMovement.detalhes, nCodMovCC: 618738728, nCodMovCCRepet: 618738728, nCodTitulo: undefined, nCodTitRepet: undefined } },
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, externalId: '618738728', movementId: '618738728' })
  })

  it('Should return mapped financial movement successfully with movement ids and title ids', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: { ...mockOmieFinancialMovement, detalhes: { ...mockOmieFinancialMovement.detalhes, nCodMovCC: 618738728, nCodMovCCRepet: 618738728, nCodTitulo: 12345678, nCodTitRepet: 12345678 } },
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, externalId: '12345678', movementId: '618738728' })
  })

  it('Should return mapped financial movement successfully without documentNumber', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: { ...mockOmieFinancialMovement, detalhes: { ...mockOmieFinancialMovement.detalhes, cNumDocFiscal: undefined } },
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, documentNumber: null })
  })

  it('Should return mapped financial movement successfully without installment', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: { ...mockOmieFinancialMovement, detalhes: { ...mockOmieFinancialMovement.detalhes, cNumParcela: undefined } },
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, installment: null })
  })

  it('Should return mapped financial movement successfully missing some dates', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: { ...mockOmieFinancialMovement, detalhes: { ...mockOmieFinancialMovement.detalhes, dDtRegistro: undefined, dDtEmissao: undefined, dDtVenc: undefined, dDtPrevisao: undefined, dDtPagamento: undefined } },
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, registerDate: '2019-05-03T03:00:00.000Z', issueDate: null, paymentDate: null, dueDate: null, expectedPaymentDate: null })
  })

  it('Should return mapped financial movement successfully with reconciliationDate', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: { ...mockOmieFinancialMovement, detalhes: { ...mockOmieFinancialMovement.detalhes, dDtConcilia: '02/01/2019' } },
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, reconciliationDate: '2019-01-02T03:00:00.000Z' })
  })

  it('Should return mapped financial movement successfully without category: use emptyRecordsIds.category instead', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: mockOmieFinancialMovement,
      omieFinancialMovementDepartment: mockOmieFinancialMovement.departamentos[0],
      omieFinancialMovementCategory: null,
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: null,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, categoryId: mockEmptyRecordsIds.category, categoryPercentage: 100, value: 195 })
  })

  it('Should return mapped financial movement successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockCategoryId,
      mockCheckingAccountId,
      mockContractId,
      mockAccountPayable,
      mockAccountReceivableId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: mockOmieFinancialMovement,
      omieFinancialMovementDepartment: null,
      omieFinancialMovementCategory: mockOmieFinancialMovement.categorias[0],
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: null,
      categoryId: mockCategoryId,
      checkingAccountId: mockCheckingAccountId,
      contractId: mockContractId,
      accountPayableId: mockAccountPayable,
      accountReceivableId: mockAccountReceivableId
    })

    expect(result).toEqual({ ...mockParsedOmieFinancialMovement, departmentId: mockEmptyRecordsIds.department, departmentPercentage: 100, value: 195 })
  })

  it('Should return mapped financial movement successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      mockOmieFinancialMovement,
      mockOmieDocumentTypes,
      mockOmieEntryOrigins,
      mockCompanyId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieFinancialMovement: mockOmieFinancialMovement,
      omieFinancialMovementDepartment: null,
      omieFinancialMovementCategory: null,
      omieEntryOrigins: mockOmieEntryOrigins,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: null,
      billing: null,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: null,
      projectId: null,
      departmentId: null,
      categoryId: null,
      checkingAccountId: null,
      contractId: null,
      accountPayableId: null,
      accountReceivableId: null
    })

    expect(result).toEqual({
      ...mockParsedOmieFinancialMovement,
      categoryId: mockEmptyRecordsIds.category,
      departmentId: mockEmptyRecordsIds.department,
      projectId: mockEmptyRecordsIds.project,
      customerId: mockEmptyRecordsIds.customer,
      checkingAccountId: mockEmptyRecordsIds.checkingAccount,
      departmentPercentage: 100,
      categoryPercentage: 100,
      value: 195,
      orderId: mockEmptyRecordsIds.order,
      orderNumber: null,
      billingId: mockEmptyRecordsIds.billing,
      origin: null,
      contractId: mockEmptyRecordsIds.contract,
      accountPayableId: mockEmptyRecordsIds.accountPayable,
      accountReceivableId: mockEmptyRecordsIds.accountReceivable
    })
  })
})
