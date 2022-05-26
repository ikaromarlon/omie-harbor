const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeServiceOrderMapping = require('../../../../src/mappings/omie/serviceOrderMapping')
const {
  emptyRecordsIdsMock,
  omieServiceOrdersResponseMock,
  omieServiceOrderParsedMock,
  omieBillingStepsResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieServiceOrderMock = omieServiceOrdersResponseMock.osCadastro[0]
  const omieBillingStepsMock = omieBillingStepsResponseMock.cadastros
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const productServiceIdMock = 'e46a6ab1-dd50-4579-b11d-d939fd35bcf3'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const contractIdMock = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: makeServiceOrderMapping({ providerName, helpers }),
    omieServiceOrderMock,
    omieBillingStepsMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    productServiceIdMock,
    categoryIdMock,
    contractIdMock
  }
}

describe('Service Order Mapping', () => {
  it('Should return mapped product sale order successfully', () => {
    const {
      sut,
      omieServiceOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieServiceOrderMock,
      omieOrderDepartment: omieServiceOrderMock.Departamentos[0],
      omieOrderItem: omieServiceOrderMock.ServicosPrestados[0],
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual(omieServiceOrderParsedMock)
  })

  it('Should return mapped product sale order successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieServiceOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieServiceOrderMock,
      omieOrderDepartment: null,
      omieOrderItem: omieServiceOrderMock.ServicosPrestados[0],
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieServiceOrderParsedMock, departmentId: emptyRecordsIdsMock.department })
  })

  it('Should return mapped product sale order successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieServiceOrderMock,
      omieBillingStepsMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieServiceOrderMock,
      omieOrderDepartment: null,
      omieOrderItem: omieServiceOrderMock.ServicosPrestados[0],
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...omieServiceOrderParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      productServiceId: emptyRecordsIdsMock.productService,
      contractId: emptyRecordsIdsMock.contract
    })
  })

  it('Should return mapped product sale order successfully without some taxes', () => {
    const {
      sut,
      omieServiceOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieServiceOrderMock,
      omieOrderDepartment: omieServiceOrderMock.Departamentos[0],
      omieOrderItem: { ...omieServiceOrderMock.ServicosPrestados[0], impostos: { ...omieServiceOrderMock.ServicosPrestados[0].impostos, nValorICMS: undefined, nValorISS: undefined } },
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual(omieServiceOrderParsedMock)
  })

  it('Should return mapped product sale order successfully with billingStep using default description', () => {
    const {
      sut,
      omieServiceOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const omieBillingStepsMock2 = JSON.parse(JSON.stringify(omieBillingStepsMock))

    const ORDER_OPERATION_CODE = '01'

    const stepMock = omieBillingStepsMock2
      .find(e => e.cCodOperacao === ORDER_OPERATION_CODE).etapas
      .find(e => e.cCodigo === omieServiceOrderMock.Cabecalho.cEtapa)
    stepMock.cDescricao = undefined
    stepMock.cDescrPadrao = 'Default description'

    const result = sut({
      omieOrder: omieServiceOrderMock,
      omieOrderDepartment: omieServiceOrderMock.Departamentos[0],
      omieOrderItem: omieServiceOrderMock.ServicosPrestados[0],
      omieBillingSteps: omieBillingStepsMock2,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieServiceOrderParsedMock, billingStep: 'Default description' })
  })

  it('Should return mapped product sale order successfully without municipalServiceCode', () => {
    const {
      sut,
      omieServiceOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieServiceOrderMock,
      omieOrderDepartment: omieServiceOrderMock.Departamentos[0],
      omieOrderItem: { ...omieServiceOrderMock.ServicosPrestados[0], cCodServMun: '' },
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieServiceOrderParsedMock, municipalServiceCode: null })
  })
})
