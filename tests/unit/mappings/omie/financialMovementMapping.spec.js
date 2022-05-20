const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeTitleMapping = require('../../../../src/mappings/omie/financialMovementMapping')
const {
  emptyRecordsIdsMock,
  omieFinancialMovementsResponseMock,
  omieFinancialMovementParsedMock,
  omieDocumentTypesResponseMock,
  omieEntryOriginsResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieFinancialMovementMock = omieFinancialMovementsResponseMock.movimentos[0]
  const omieDocumentTypesMock = omieDocumentTypesResponseMock.tipo_documento_cadastro
  const omieEntryOriginsMock = omieEntryOriginsResponseMock.origem
  const orderMock = { _id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15' }
  const billingMock = { _id: '7be89715-63e6-426a-a952-ae19b700a28f', type: 'NFS-e' }
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const checkingAccountIdMock = 'e5e74170-40ee-42d9-9741-6d708200e306'
  const contractIdMock = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'
  const accountPayableIdMock = '2f9671a0-1b1e-4e45-8f59-b76f10af37e1'
  const accountReceivableIdMock = null

  return {
    sut: makeTitleMapping({ providerName, helpers }),
    omieFinancialMovementMock,
    omieDocumentTypesMock,
    omieEntryOriginsMock,
    orderMock,
    billingMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    categoryIdMock,
    checkingAccountIdMock,
    contractIdMock,
    accountPayableIdMock,
    accountReceivableIdMock
  }
}

describe('FinancialMovement Mapping', () => {
  it('Should return mapped financial movement successfully', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: omieFinancialMovementMock,
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual(omieFinancialMovementParsedMock)
  })

  it('Should return mapped financial movement successfully with movement ids and missing title ids', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: { ...omieFinancialMovementMock, detalhes: { ...omieFinancialMovementMock.detalhes, nCodMovCC: 618738728, nCodMovCCRepet: 618738728, nCodTitulo: undefined, nCodTitRepet: undefined } },
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, externalId: '618738728', movementId: '618738728' })
  })

  it('Should return mapped financial movement successfully with movement ids and title ids', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: { ...omieFinancialMovementMock, detalhes: { ...omieFinancialMovementMock.detalhes, nCodMovCC: 618738728, nCodMovCCRepet: 618738728, nCodTitulo: 12345678, nCodTitRepet: 12345678 } },
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, externalId: '12345678', movementId: '618738728' })
  })

  it('Should return mapped financial movement successfully without documentNumber', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: { ...omieFinancialMovementMock, detalhes: { ...omieFinancialMovementMock.detalhes, cNumDocFiscal: undefined } },
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, documentNumber: null })
  })

  it('Should return mapped financial movement successfully without installment', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: { ...omieFinancialMovementMock, detalhes: { ...omieFinancialMovementMock.detalhes, cNumParcela: undefined } },
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, installment: null })
  })

  it('Should return mapped financial movement successfully missing some dates', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: { ...omieFinancialMovementMock, detalhes: { ...omieFinancialMovementMock.detalhes, dDtRegistro: undefined, dDtEmissao: undefined, dDtVenc: undefined, dDtPrevisao: undefined, dDtPagamento: undefined } },
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, registerDate: '2019-05-03', issueDate: null, paymentDate: null, dueDate: null, expectedPaymentDate: null })
  })

  it('Should return mapped financial movement successfully with reconciliationDate', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: { ...omieFinancialMovementMock, detalhes: { ...omieFinancialMovementMock.detalhes, dDtConcilia: '02/01/2019' } },
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, reconciliationDate: '2019-01-02' })
  })

  it('Should return mapped financial movement successfully without category: use emptyRecordsIds.category instead', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: omieFinancialMovementMock,
      omieFinancialMovementDepartment: omieFinancialMovementMock.departamentos[0],
      omieFinancialMovementCategory: null,
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: null,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, categoryId: emptyRecordsIdsMock.category, categoryPercentage: 100, value: 195 })
  })

  it('Should return mapped financial movement successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      categoryIdMock,
      checkingAccountIdMock,
      contractIdMock,
      accountPayableIdMock,
      accountReceivableIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: omieFinancialMovementMock,
      omieFinancialMovementDepartment: null,
      omieFinancialMovementCategory: omieFinancialMovementMock.categorias[0],
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      categoryId: categoryIdMock,
      checkingAccountId: checkingAccountIdMock,
      contractId: contractIdMock,
      accountPayableId: accountPayableIdMock,
      accountReceivableId: accountReceivableIdMock
    })

    expect(result).toEqual({ ...omieFinancialMovementParsedMock, departmentId: emptyRecordsIdsMock.department, departmentPercentage: 100, value: 195 })
  })

  it('Should return mapped financial movement successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieFinancialMovementMock,
      omieDocumentTypesMock,
      omieEntryOriginsMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieFinancialMovement: omieFinancialMovementMock,
      omieFinancialMovementDepartment: null,
      omieFinancialMovementCategory: null,
      omieEntryOrigins: omieEntryOriginsMock,
      omieDocumentTypes: omieDocumentTypesMock,
      order: null,
      billing: null,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
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
      ...omieFinancialMovementParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      checkingAccountId: emptyRecordsIdsMock.checkingAccount,
      departmentPercentage: 100,
      categoryPercentage: 100,
      value: 195,
      orderId: emptyRecordsIdsMock.order,
      orderNumber: null,
      billingId: emptyRecordsIdsMock.billing,
      origin: null,
      contractId: emptyRecordsIdsMock.contract,
      accountPayableId: emptyRecordsIdsMock.accountPayable,
      accountReceivableId: emptyRecordsIdsMock.accountReceivable
    })
  })
})
