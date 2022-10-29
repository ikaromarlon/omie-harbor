const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeProductInvoiceMapping = require('../../../../src/mappings/omie/productInvoiceMapping')
const {
  mockEmptyRecordsIds,
  mockOmieProductInvoicesResponse,
  mockParsedOmieProductInvoice
} = require('../../../mocks')

const makeSut = () => {
  const mockOmieProductInvoice = mockOmieProductInvoicesResponse.nfCadastro[0]
  const mockOrder = { _id: '48f1af6e-be36-4e8a-85ea-23976e36e3c0', orderNumber: '000000000000013', type: 'PEDIDO' }
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockProductServiceId = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'

  return {
    sut: makeProductInvoiceMapping({ providerName }),
    mockOmieProductInvoice,
    mockOrder,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockProductServiceId,
    mockCategoryId
  }
}

describe('Product Invoice Mapping', () => {
  it('Should return mapped product invoice successfully', () => {
    const {
      sut,
      mockOmieProductInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      omieInvoice: mockOmieProductInvoice,
      omieInvoiceDepartment: mockOmieProductInvoice.pedido.Departamentos[0],
      omieInvoiceItem: mockOmieProductInvoice.det[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual(mockParsedOmieProductInvoice)
  })

  it('Should return mapped product invoice successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      mockOmieProductInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      omieInvoice: mockOmieProductInvoice,
      omieInvoiceDepartment: null,
      omieInvoiceItem: mockOmieProductInvoice.det[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: null,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockParsedOmieProductInvoice, departmentId: mockEmptyRecordsIds.department })
  })

  it('Should return mapped product invoice successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      mockOmieProductInvoice,
      mockCompanyId
    } = makeSut()

    const result = sut({
      omieInvoice: mockOmieProductInvoice,
      omieInvoiceDepartment: null,
      omieInvoiceItem: mockOmieProductInvoice.det[0],
      emptyRecordsIds: mockEmptyRecordsIds,
      order: null,
      companyId: mockCompanyId,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null
    })

    expect(result).toEqual({
      ...mockParsedOmieProductInvoice,
      categoryId: mockEmptyRecordsIds.category,
      departmentId: mockEmptyRecordsIds.department,
      projectId: mockEmptyRecordsIds.project,
      customerId: mockEmptyRecordsIds.customer,
      productServiceId: mockEmptyRecordsIds.productService,
      orderId: mockEmptyRecordsIds.order,
      orderNumber: null,
      origin: null
    })
  })

  it('Should return mapped product invoice successfully with taxes', () => {
    const {
      sut,
      mockOmieProductInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      omieInvoice: mockOmieProductInvoice,
      omieInvoiceDepartment: mockOmieProductInvoice.pedido.Departamentos[0],
      omieInvoiceItem: { ...mockOmieProductInvoice.det[0], prod: { ...mockOmieProductInvoice.det[0].prod, vIR: 0, vPIS: 0, vCOFINS: 0, vCSLL: 0, vICMS: 0, vISS: 0 } },
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual(mockParsedOmieProductInvoice)
  })

  it('Should return mapped product invoice successfully without cfop', () => {
    const {
      sut,
      mockOmieProductInvoice,
      mockOrder,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      omieInvoice: mockOmieProductInvoice,
      omieInvoiceDepartment: mockOmieProductInvoice.pedido.Departamentos[0],
      omieInvoiceItem: { ...mockOmieProductInvoice.det[0], prod: { ...mockOmieProductInvoice.det[0].prod, CFOP: '' } },
      emptyRecordsIds: mockEmptyRecordsIds,
      order: mockOrder,
      companyId: mockCompanyId,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockParsedOmieProductInvoice, cfop: null })
  })
})
