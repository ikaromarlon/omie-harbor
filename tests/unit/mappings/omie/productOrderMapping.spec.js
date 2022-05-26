const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeProductOrderMapping = require('../../../../src/mappings/omie/productOrderMapping')
const {
  emptyRecordsIdsMock,
  omieProductOrdersResponseMock,
  omieProductOrderParsedMock,
  omieBillingStepsResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieProductOrderMock = omieProductOrdersResponseMock.pedido_venda_produto[0]
  const omieBillingStepsMock = omieBillingStepsResponseMock.cadastros
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const productServiceIdMock = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'

  return {
    sut: makeProductOrderMapping({ providerName, helpers }),
    omieProductOrderMock,
    omieBillingStepsMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    productServiceIdMock,
    categoryIdMock
  }
}

describe('Product Sale Order Mapping', () => {
  it('Should return mapped product sale order successfully', () => {
    const {
      sut,
      omieProductOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieProductOrderMock,
      omieOrderDepartment: omieProductOrderMock.departamentos[0],
      omieOrderItem: omieProductOrderMock.det[0],
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual(omieProductOrderParsedMock)
  })

  it('Should return mapped product sale order successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieProductOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieProductOrderMock,
      omieOrderDepartment: null,
      omieOrderItem: omieProductOrderMock.det[0],
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual({ ...omieProductOrderParsedMock, departmentId: emptyRecordsIdsMock.department })
  })

  it('Should return mapped product sale order successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieProductOrderMock,
      omieBillingStepsMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieProductOrderMock,
      omieOrderDepartment: null,
      omieOrderItem: omieProductOrderMock.det[0],
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null
    })

    expect(result).toEqual({
      ...omieProductOrderParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      productServiceId: emptyRecordsIdsMock.productService
    })
  })

  it('Should return mapped product sale order successfully without some taxes', () => {
    const {
      sut,
      omieProductOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieProductOrderMock,
      omieOrderDepartment: omieProductOrderMock.departamentos[0],
      omieOrderItem: { ...omieProductOrderMock.det[0], imposto: { ...omieProductOrderMock.det[0].imposto, pis_st: { valor_pis_st: undefined }, cofins_st: { valor_cofins_st: undefined }, icms_sn: { valor_icms_sn: undefined }, icms_st: { valor_icms_st: undefined } } },
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual(omieProductOrderParsedMock)
  })

  it('Should return mapped product sale order successfully with billingStep using default description', () => {
    const {
      sut,
      omieProductOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const omieBillingStepsMock2 = JSON.parse(JSON.stringify(omieBillingStepsMock))

    const ORDER_OPERATION_CODE = '11'

    const stepMock = omieBillingStepsMock2
      .find(e => e.cCodOperacao === ORDER_OPERATION_CODE).etapas
      .find(e => e.cCodigo === omieProductOrderMock.cabecalho.etapa)
    stepMock.cDescricao = undefined
    stepMock.cDescrPadrao = 'Default description'

    const result = sut({
      omieOrder: omieProductOrderMock,
      omieOrderDepartment: omieProductOrderMock.departamentos[0],
      omieOrderItem: omieProductOrderMock.det[0],
      omieBillingSteps: omieBillingStepsMock2,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual({ ...omieProductOrderParsedMock, billingStep: 'Default description' })
  })

  it('Should return mapped product sale order successfully without cfop', () => {
    const {
      sut,
      omieProductOrderMock,
      omieBillingStepsMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieOrder: omieProductOrderMock,
      omieOrderDepartment: omieProductOrderMock.departamentos[0],
      omieOrderItem: { ...omieProductOrderMock.det[0], produto: { ...omieProductOrderMock.det[0].produto, cfop: '' } },
      omieBillingSteps: omieBillingStepsMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual({ ...omieProductOrderParsedMock, cfop: null })
  })
})
