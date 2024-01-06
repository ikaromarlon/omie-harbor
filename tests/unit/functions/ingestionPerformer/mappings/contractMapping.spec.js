const contractMapping = require('../../../../../src/functions/ingestionPerformer/mappings/contractMapping')
const {
  mockEmptyRecordsIds,
  mockOmieContractsResponse,
  mockParsedOmieContract,
  mockOmieContractStepsResponse,
  mockOmieContractBillingTypesResponse
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieContract = mockOmieContractsResponse.contratoCadastro[0]
  const mockOmieContractSteps = mockOmieContractStepsResponse
  const mockOmieContractBillingTypes = mockOmieContractBillingTypesResponse.cadastros
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'
  const mockCustomerId = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const mockProjectId = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const mockDepartmentId = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const mockProductServiceId = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const mockCategoryId = '44d50267-4bc1-42bc-923a-00df2968a2be'

  return {
    sut: contractMapping,
    mockOmieContract,
    mockOmieContractSteps,
    mockOmieContractBillingTypes,
    mockCompanyId,
    mockCustomerId,
    mockProjectId,
    mockDepartmentId,
    mockProductServiceId,
    mockCategoryId
  }
}

describe('Contract Mapping', () => {
  it('Should return mapped contract successfully', () => {
    const {
      sut,
      mockOmieContract,
      mockOmieContractSteps,
      mockOmieContractBillingTypes,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieContract: mockOmieContract,
      omieContractDepartment: mockOmieContract.departamentos[0],
      omieContractItem: mockOmieContract.itensContrato[0],
      omieContractBillingTypes: mockOmieContractBillingTypes,
      omieContractSteps: mockOmieContractSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual(mockParsedOmieContract)
  })

  it('Should return mapped contract successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      mockOmieContract,
      mockOmieContractSteps,
      mockOmieContractBillingTypes,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieContract: mockOmieContract,
      omieContractDepartment: null,
      omieContractItem: mockOmieContract.itensContrato[0],
      omieContractBillingTypes: mockOmieContractBillingTypes,
      omieContractSteps: mockOmieContractSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: null,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockParsedOmieContract, departmentId: mockEmptyRecordsIds.department })
  })

  it('Should return mapped contract successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      mockOmieContract,
      mockOmieContractSteps,
      mockOmieContractBillingTypes,
      mockCompanyId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieContract: mockOmieContract,
      omieContractDepartment: null,
      omieContractItem: mockOmieContract.itensContrato[0],
      omieContractBillingTypes: mockOmieContractBillingTypes,
      omieContractSteps: mockOmieContractSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null
    })

    expect(result).toEqual({
      ...mockParsedOmieContract,
      categoryId: mockEmptyRecordsIds.category,
      departmentId: mockEmptyRecordsIds.department,
      projectId: mockEmptyRecordsIds.project,
      customerId: mockEmptyRecordsIds.customer,
      productServiceId: mockEmptyRecordsIds.productService
    })
  })

  it('Should return mapped contract successfully with ICMS and no ISS', () => {
    const {
      sut,
      mockOmieContract,
      mockOmieContractSteps,
      mockOmieContractBillingTypes,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieContract: mockOmieContract,
      omieContractDepartment: mockOmieContract.departamentos[0],
      omieContractItem: { ...mockOmieContract.itensContrato[0], itemImpostos: { ...mockOmieContract.itensContrato[0].itemImpostos, valorICMS: 0, valorISS: undefined } },
      omieContractBillingTypes: mockOmieContractBillingTypes,
      omieContractSteps: mockOmieContractSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual(mockParsedOmieContract)
  })

  it('Should return mapped contract successfully without step', () => {
    const {
      sut,
      mockOmieContract,
      mockOmieContractSteps,
      mockOmieContractBillingTypes,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieContract: { ...mockOmieContract, cabecalho: { ...mockOmieContract.cabecalho, nCodCtr: 123456 } },
      omieContractDepartment: mockOmieContract.departamentos[0],
      omieContractItem: mockOmieContract.itensContrato[0],
      omieContractBillingTypes: mockOmieContractBillingTypes,
      omieContractSteps: mockOmieContractSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockParsedOmieContract, externalId: '123456', step: null })
  })

  it('Should return mapped contract successfully without municipalServiceCode', () => {
    const {
      sut,
      mockOmieContract,
      mockOmieContractSteps,
      mockOmieContractBillingTypes,
      mockCompanyId,
      mockCustomerId,
      mockProjectId,
      mockDepartmentId,
      mockProductServiceId,
      mockCategoryId
    } = makeSut()

    const result = sut({
      companyId: mockCompanyId,
      omieContract: mockOmieContract,
      omieContractDepartment: mockOmieContract.departamentos[0],
      omieContractItem: { ...mockOmieContract.itensContrato[0], itemCabecalho: { ...mockOmieContract.itensContrato[0].itemCabecalho, codServMunic: '' } },
      omieContractBillingTypes: mockOmieContractBillingTypes,
      omieContractSteps: mockOmieContractSteps,
      emptyRecordsIds: mockEmptyRecordsIds,
      customerId: mockCustomerId,
      projectId: mockProjectId,
      departmentId: mockDepartmentId,
      productServiceId: mockProductServiceId,
      categoryId: mockCategoryId
    })

    expect(result).toEqual({ ...mockParsedOmieContract, municipalServiceCode: null })
  })
})
