const serviceInvoiceMapping = require('../../../../../src/functions/ingestionPerformer/mappings/serviceInvoiceMapping')
const {
  mockEmptyRecordsIds,
  mockOmieServiceInvoicesResponse,
  mockParsedOmieServiceInvoice
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieServiceInvoice = mockOmieServiceInvoicesResponse.nfseEncontradas[0]
  const mockOrder = { id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15', type: 'OS' }
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockProductServiceId = 'e46a6ab1-dd50-4579-b11d-d939fd35bcf3'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const mockContractId = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: serviceInvoiceMapping,
    mockOmieServiceInvoice,
    mockOrder,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockProductServiceId,
    mockCategoryId,
    mockContractId
  }
}

describe('Service Invoice Mapping', () => {
  it('Should return mapped service invoice successfully', () => {
    const {
      sut,
      mockOmieServiceInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieInvoice: mockOmieServiceInvoice,
      omieInvoiceDepartment: mockOmieServiceInvoice.OrdemServico.Departamentos[0],
      omieInvoiceItem: mockOmieServiceInvoice.ListaServicos[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockParsedOmieServiceInvoice)
  })

  it('Should return mapped service invoice successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      mockOmieServiceInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockProductServiceId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieInvoice: mockOmieServiceInvoice,
      omieInvoiceDepartment: null,
      omieInvoiceItem: mockOmieServiceInvoice.ListaServicos[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: null,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieServiceInvoice, departmentId: mockEmptyRecordsIds.department })
  })

  it('Should return mapped service invoice successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      mockOmieServiceInvoice,
      mockCompanyId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieInvoice: mockOmieServiceInvoice,
      omieInvoiceDepartment: null,
      omieInvoiceItem: mockOmieServiceInvoice.ListaServicos[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: null,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...mockParsedOmieServiceInvoice,
      categoryId: mockEmptyRecordsIds.category,
      departmentId: mockEmptyRecordsIds.department,
      projectId: mockEmptyRecordsIds.project,
      customerId: mockEmptyRecordsIds.customer,
      productServiceId: mockEmptyRecordsIds.productService,
      contractId: mockEmptyRecordsIds.contract,
      orderId: mockEmptyRecordsIds.order,
      orderNumber: null,
      origin: null
    })
  })

  it('Should return mapped service invoice successfully without document data', () => {
    const {
      sut,
      mockOmieServiceInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieInvoice: { ...mockOmieServiceInvoice, Cabecalho: { ...mockOmieServiceInvoice.Cabecalho, nChaveNFe: undefined, nNumeroNFSe: undefined } },
      omieInvoiceDepartment: mockOmieServiceInvoice.OrdemServico.Departamentos[0],
      omieInvoiceItem: mockOmieServiceInvoice.ListaServicos[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieServiceInvoice, documentKey: null, documentNumber: null })
  })

  it('Should return mapped service invoice successfully without some taxes', () => {
    const {
      sut,
      mockOmieServiceInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieInvoice: mockOmieServiceInvoice,
      omieInvoiceDepartment: mockOmieServiceInvoice.OrdemServico.Departamentos[0],
      omieInvoiceItem: { ...mockOmieServiceInvoice.ListaServicos[0], nValorICMS: undefined, nValorISS: undefined },
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockParsedOmieServiceInvoice)
  })
})
