const productOrderMapping = require('../../../../../src/functions/ingestionPerformer/mappings/productOrderMapping')
const {
  mockOmieProductOrdersResponse,
  mockProductOrder,
  mockOmieBillingStepsResponse
} = require('../../../../mocks')

delete mockProductOrder.id
delete mockProductOrder.createdAt
delete mockProductOrder.updatedAt

const makeSut = () => {
  const mockOmieProductOrder = mockOmieProductOrdersResponse.pedido_venda_produto[0]
  const mockOmieBillingSteps = mockOmieBillingStepsResponse.cadastros
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockProductServiceId = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'

  return {
    sut: productOrderMapping,
    mockOmieProductOrder,
    mockOmieBillingSteps,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockProductServiceId,
    mockCategoryId
  }
}

describe('Product Sale Order Mapping', () => {
  it('Should return mapped product sale order successfully', () => {
    const {
      sut,
      mockOmieProductOrder,
      mockOmieBillingSteps,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieProductOrder,
      omieOrderDepartment: mockOmieProductOrder.departamentos[0],
      omieOrderItem: mockOmieProductOrder.det[0],
      omieBillingSteps: mockOmieBillingSteps,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual(mockProductOrder)
  })

  it('Should return mapped product sale order successfully without relationships', () => {
    const {
      sut,
      mockOmieProductOrder,
      mockOmieBillingSteps,
      mockCompanyId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieProductOrder,
      omieOrderDepartment: null,
      omieOrderItem: mockOmieProductOrder.det[0],
      omieBillingSteps: mockOmieBillingSteps,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null
    })

    expect(result).toEqual({
      ...mockProductOrder,
      categoryId: null,
      departmentId: null,
      projectId: null,
      customerId: null,
      productServiceId: null
    })
  })

  it('Should return mapped product sale order successfully without some taxes', () => {
    const {
      sut,
      mockOmieProductOrder,
      mockOmieBillingSteps,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieProductOrder,
      omieOrderDepartment: mockOmieProductOrder.departamentos[0],
      omieOrderItem: { ...mockOmieProductOrder.det[0], imposto: { ...mockOmieProductOrder.det[0].imposto, pis_st: { valor_pis_st: undefined }, cofins_st: { valor_cofins_st: undefined }, icms_sn: { valor_icms_sn: undefined }, icms_st: { valor_icms_st: undefined } } },
      omieBillingSteps: mockOmieBillingSteps,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual(mockProductOrder)
  })

  it('Should return mapped product sale order successfully with billingStep using default description', () => {
    const {
      sut,
      mockOmieProductOrder,
      mockOmieBillingSteps,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const mockOmieBillingSteps2 = JSON.parse(JSON.stringify(mockOmieBillingSteps))

    const ORDER_OPERATION_CODE = '11'

    const mockStep = mockOmieBillingSteps2
      .find(e => e.cCodOperacao === ORDER_OPERATION_CODE).etapas
      .find(e => e.cCodigo === mockOmieProductOrder.cabecalho.etapa)
    mockStep.cDescricao = undefined
    mockStep.cDescrPadrao = 'Default description'

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieProductOrder,
      omieOrderDepartment: mockOmieProductOrder.departamentos[0],
      omieOrderItem: mockOmieProductOrder.det[0],
      omieBillingSteps: mockOmieBillingSteps2,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockProductOrder, billingStep: 'Default description' })
  })

  it('Should return mapped product sale order successfully without cfop', () => {
    const {
      sut,
      mockOmieProductOrder,
      mockOmieBillingSteps,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieProductOrder,
      omieOrderDepartment: mockOmieProductOrder.departamentos[0],
      omieOrderItem: { ...mockOmieProductOrder.det[0], produto: { ...mockOmieProductOrder.det[0].produto, cfop: '' } },
      omieBillingSteps: mockOmieBillingSteps,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockProductOrder, cfop: null })
  })
})
