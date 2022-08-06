const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeTitleMapping = require('../../../../src/mappings/omie/titleMapping')
const {
  mockEmptyRecordsIds,
  mockOmieAccountsReceivableResponse,
  mockParsedOmieAccountReceivable,
  mockOmieDocumentTypesResponse
} = require('../../../mocks')

const makeSut = () => {
  const mockOmieTitle = mockOmieAccountsReceivableResponse.titulosEncontrados[0]
  const mockOmieDocumentTypes = mockOmieDocumentTypesResponse.tipo_documento_cadastro
  const mockOrder = { _id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15', type: 'OS' }
  const mockBilling = { _id: '7be89715-63e6-426a-a952-ae19b700a28f', type: 'NFS-e' }
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const mockContractId = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: makeTitleMapping({ providerName, helpers }),
    mockOmieTitle,
    mockOmieDocumentTypes,
    mockOrder,
    mockBilling,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockCategoryId,
    mockContractId
  }
}

describe('Title Mapping', () => {
  it('Should return mapped title successfully', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      omieTitle: mockOmieTitle,
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockParsedOmieAccountReceivable)
  })

  it('Should return mapped title successfully without documentNumber', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      omieTitle: { ...mockOmieTitle, cabecTitulo: { ...mockOmieTitle.cabecTitulo, cNumDocFiscal: undefined } },
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieAccountReceivable, documentNumber: null })
  })

  it('Should return mapped title successfully missing some dates', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      omieTitle: { ...mockOmieTitle, cabecTitulo: { ...mockOmieTitle.cabecTitulo, dDtEmissao: undefined, dDtPagamento: undefined } },
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieAccountReceivable, issueDate: null, paymentDate: null })
  })

  it('Should return mapped title successfully without category: use emptyRecordsIds.category instead', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockContractId
    } = makeSut()

    const result = sut({
      omieTitle: mockOmieTitle,
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: null,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: null,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieAccountReceivable, categoryId: mockEmptyRecordsIds.category })
  })

  it('Should return mapped title successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      omieTitle: mockOmieTitle,
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: null,
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: null,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieAccountReceivable, departmentId: mockEmptyRecordsIds.department })
  })

  it('Should return mapped title successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockCompanyId
    } = makeSut()

    const result = sut({
      omieTitle: mockOmieTitle,
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: null,
      omieTitleCategory: null,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: null,
      billing: null,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: null,
      projectId: null,
      departmentId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...mockParsedOmieAccountReceivable,
      categoryId: mockEmptyRecordsIds.category,
      departmentId: mockEmptyRecordsIds.department,
      projectId: mockEmptyRecordsIds.project,
      customerId: mockEmptyRecordsIds.customer,
      contractId: mockEmptyRecordsIds.contract,
      orderId: mockEmptyRecordsIds.order,
      orderNumber: null,
      billingId: mockEmptyRecordsIds.billing,
      origin: null
    })
  })

  it('Should return mapped title successfully without taxes', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockOrder,
      mockBilling,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      omieTitle: { ...mockOmieTitle, cabecTitulo: { ...mockOmieTitle.cabecTitulo, nValorIR: undefined, nValorPIS: undefined, nValorCOFINS: undefined, nValorCSLL: undefined, nValorICMS: undefined, nValorISS: undefined } },
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      emptyRecordsIds: mockEmptyRecordsIds,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockParsedOmieAccountReceivable)
  })
})
