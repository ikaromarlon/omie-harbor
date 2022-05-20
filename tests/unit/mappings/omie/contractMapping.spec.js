const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeContractMapping = require('../../../../src/mappings/omie/contractMapping')
const {
  emptyRecordsIdsMock,
  omieContractsResponseMock,
  omieContractParsedMock,
  omieContractStepsResponseMock,
  omieContractBillingTypesResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieContractMock = omieContractsResponseMock.contratoCadastro[0]
  const omieContractStepsMock = omieContractStepsResponseMock
  const omieContractBillingTypesMock = omieContractBillingTypesResponseMock.cadastros
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const productServiceIdMock = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'

  return {
    sut: makeContractMapping({ providerName, helpers }),
    omieContractMock,
    omieContractStepsMock,
    omieContractBillingTypesMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    productServiceIdMock,
    categoryIdMock
  }
}

describe('Contract Mapping', () => {
  it('Should return mapped contract successfully', () => {
    const {
      sut,
      omieContractMock,
      omieContractStepsMock,
      omieContractBillingTypesMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieContract: omieContractMock,
      omieContractDepartment: omieContractMock.departamentos[0],
      omieContractItem: omieContractMock.itensContrato[0],
      omieContractBillingTypes: omieContractBillingTypesMock,
      omieContractSteps: omieContractStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual(omieContractParsedMock)
  })

  it('Should return mapped contract successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieContractMock,
      omieContractStepsMock,
      omieContractBillingTypesMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieContract: omieContractMock,
      omieContractDepartment: null,
      omieContractItem: omieContractMock.itensContrato[0],
      omieContractBillingTypes: omieContractBillingTypesMock,
      omieContractSteps: omieContractStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual({ ...omieContractParsedMock, departmentId: emptyRecordsIdsMock.department })
  })

  it('Should return mapped contract successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieContractMock,
      omieContractStepsMock,
      omieContractBillingTypesMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieContract: omieContractMock,
      omieContractDepartment: null,
      omieContractItem: omieContractMock.itensContrato[0],
      omieContractBillingTypes: omieContractBillingTypesMock,
      omieContractSteps: omieContractStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null
    })

    expect(result).toEqual({
      ...omieContractParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      productServiceId: emptyRecordsIdsMock.productService
    })
  })

  it('Should return mapped contract successfully with ICMS and no ISS', () => {
    const {
      sut,
      omieContractMock,
      omieContractStepsMock,
      omieContractBillingTypesMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieContract: omieContractMock,
      omieContractDepartment: omieContractMock.departamentos[0],
      omieContractItem: { ...omieContractMock.itensContrato[0], itemImpostos: { ...omieContractMock.itensContrato[0].itemImpostos, valorICMS: 0, valorISS: undefined } },
      omieContractBillingTypes: omieContractBillingTypesMock,
      omieContractSteps: omieContractStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual(omieContractParsedMock)
  })

  it('Should return mapped contract successfully without step', () => {
    const {
      sut,
      omieContractMock,
      omieContractStepsMock,
      omieContractBillingTypesMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieContract: { ...omieContractMock, cabecalho: { ...omieContractMock.cabecalho, nCodCtr: 123456 } },
      omieContractDepartment: omieContractMock.departamentos[0],
      omieContractItem: omieContractMock.itensContrato[0],
      omieContractBillingTypes: omieContractBillingTypesMock,
      omieContractSteps: omieContractStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual({ ...omieContractParsedMock, externalId: '123456', step: null })
  })
})
