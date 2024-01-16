const titleMapping = require('../../../../../src/functions/ingestionPerformer/mappings/titleMapping')
const {
  mockOmieAccountsReceivableResponse,
  mockAccountReceivable,
  mockOmieDocumentTypesResponse
} = require('../../../../mocks')

delete mockAccountReceivable.id
delete mockAccountReceivable.createdAt
delete mockAccountReceivable.updatedAt

const makeSut = () => {
  const mockOmieTitle = mockOmieAccountsReceivableResponse.titulosEncontrados[0]
  const mockOmieDocumentTypes = mockOmieDocumentTypesResponse.tipo_documento_cadastro
  const mockOrder = { id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15', type: 'OS' }
  const mockBilling = { id: '7be89715-63e6-426a-a952-ae19b700a28f', type: 'NFS-e' }
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const mockContractId = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: titleMapping,
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
      companyId: mockCompanyId,
      omieTitle: mockOmieTitle,
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockAccountReceivable)
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
      companyId: mockCompanyId,
      omieTitle: { ...mockOmieTitle, cabecTitulo: { ...mockOmieTitle.cabecTitulo, cNumDocFiscal: undefined } },
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockAccountReceivable, documentNumber: null })
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
      companyId: mockCompanyId,
      omieTitle: { ...mockOmieTitle, cabecTitulo: { ...mockOmieTitle.cabecTitulo, dDtEmissao: undefined, dDtPagamento: undefined } },
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockAccountReceivable, issueDate: null, paymentDate: null })
  })

  it('Should return mapped title successfully without relationships', () => {
    const {
      sut,
      mockOmieTitle,
      mockOmieDocumentTypes,
      mockCompanyId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieTitle: mockOmieTitle,
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: null,
      omieTitleCategory: null,
      omieDocumentTypes: mockOmieDocumentTypes,
      order: null,
      billing: null,
      customerId: null,
      projectId: null,
      departmentId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...mockAccountReceivable,
      categoryId: null,
      departmentId: null,
      projectId: null,
      customerId: null,
      contractId: null,
      orderId: null,
      orderNumber: null,
      billingId: null,
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
      companyId: mockCompanyId,
      omieTitle: { ...mockOmieTitle, cabecTitulo: { ...mockOmieTitle.cabecTitulo, nValorIR: undefined, nValorPIS: undefined, nValorCOFINS: undefined, nValorCSLL: undefined, nValorICMS: undefined, nValorISS: undefined } },
      omieTitleEntries: mockOmieTitle.lancamentos,
      omieTitleDepartment: mockOmieTitle.departamentos[0],
      omieTitleCategory: mockOmieTitle.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: mockOmieDocumentTypes,
      order: mockOrder,
      billing: mockBilling,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockAccountReceivable)
  })
})
