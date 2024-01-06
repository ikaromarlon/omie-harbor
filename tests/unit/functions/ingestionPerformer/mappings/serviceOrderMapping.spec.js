const serviceOrderMapping = require('../../../../../src/functions/ingestionPerformer/mappings/serviceOrderMapping')
const {
  mockEmptyRecordsIds,
  mockOmieServiceOrdersResponse,
  mockParsedOmieServiceOrder,
  mockOmieBillingStepsResponse
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieServiceOrder = mockOmieServiceOrdersResponse.osCadastro[0]
  const mockOmieBillingSteps = mockOmieBillingStepsResponse.cadastros
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockProductServiceId = 'e46a6ab1-dd50-4579-b11d-d939fd35bcf3'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const mockContractId = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: serviceOrderMapping,
    mockOmieServiceOrder,
    mockOmieBillingSteps,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockProductServiceId,
    mockCategoryId,
    mockContractId
  }
}

describe('Service Order Mapping', () => {
  it('Should return mapped product sale order successfully', () => {
    const {
      sut,
      mockOmieServiceOrder,
      mockOmieBillingSteps,
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
      omieOrder: mockOmieServiceOrder,
      omieOrderDepartment: mockOmieServiceOrder.Departamentos[0],
      omieOrderItem: mockOmieServiceOrder.ServicosPrestados[0],
      omieBillingSteps: mockOmieBillingSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockParsedOmieServiceOrder)
  })

  it('Should return mapped product sale order successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      mockOmieServiceOrder,
      mockOmieBillingSteps,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockProductServiceId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieServiceOrder,
      omieOrderDepartment: null,
      omieOrderItem: mockOmieServiceOrder.ServicosPrestados[0],
      omieBillingSteps: mockOmieBillingSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: null,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieServiceOrder, departmentId: mockEmptyRecordsIds.department })
  })

  it('Should return mapped product sale order successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      mockOmieServiceOrder,
      mockOmieBillingSteps,
      mockCompanyId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieServiceOrder,
      omieOrderDepartment: null,
      omieOrderItem: mockOmieServiceOrder.ServicosPrestados[0],
      omieBillingSteps: mockOmieBillingSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...mockParsedOmieServiceOrder,
      categoryId: mockEmptyRecordsIds.category,
      departmentId: mockEmptyRecordsIds.department,
      projectId: mockEmptyRecordsIds.project,
      customerId: mockEmptyRecordsIds.customer,
      productServiceId: mockEmptyRecordsIds.productService,
      contractId: mockEmptyRecordsIds.contract
    })
  })

  it('Should return mapped product sale order successfully without some taxes', () => {
    const {
      sut,
      mockOmieServiceOrder,
      mockOmieBillingSteps,
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
      omieOrder: mockOmieServiceOrder,
      omieOrderDepartment: mockOmieServiceOrder.Departamentos[0],
      omieOrderItem: { ...mockOmieServiceOrder.ServicosPrestados[0], impostos: { ...mockOmieServiceOrder.ServicosPrestados[0].impostos, nValorICMS: undefined, nValorISS: undefined } },
      omieBillingSteps: mockOmieBillingSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual(mockParsedOmieServiceOrder)
  })

  it('Should return mapped product sale order successfully with billingStep using default description', () => {
    const {
      sut,
      mockOmieServiceOrder,
      mockOmieBillingSteps,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId,
      mockContractId
    } = makeSut()

    const mockOmieBillingSteps2 = JSON.parse(JSON.stringify(mockOmieBillingSteps))

    const ORDER_OPERATION_CODE = '01'

    const mockStep = mockOmieBillingSteps2
      .find(e => e.cCodOperacao === ORDER_OPERATION_CODE).etapas
      .find(e => e.cCodigo === mockOmieServiceOrder.Cabecalho.cEtapa)
    mockStep.cDescricao = undefined
    mockStep.cDescrPadrao = 'Default description'

    const result = sut({
      companyId: mockCompanyId,
      omieOrder: mockOmieServiceOrder,
      omieOrderDepartment: mockOmieServiceOrder.Departamentos[0],
      omieOrderItem: mockOmieServiceOrder.ServicosPrestados[0],
      omieBillingSteps: mockOmieBillingSteps2,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieServiceOrder, billingStep: 'Default description' })
  })

  it('Should return mapped product sale order successfully without municipalServiceCode', () => {
    const {
      sut,
      mockOmieServiceOrder,
      mockOmieBillingSteps,
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
      omieOrder: mockOmieServiceOrder,
      omieOrderDepartment: mockOmieServiceOrder.Departamentos[0],
      omieOrderItem: { ...mockOmieServiceOrder.ServicosPrestados[0], cCodServMun: '' },
      omieBillingSteps: mockOmieBillingSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId,
      contractId: mockContractId
    })

    expect(result).toEqual({ ...mockParsedOmieServiceOrder, municipalServiceCode: null })
  })
})
