const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeProductInvoiceMapping = require('../../../../src/mappings/omie/productInvoiceMapping')
const {
  emptyRecordsIdsMock,
  omieProductInvoicesResponseMock,
  omieProductInvoiceParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const omieProductInvoiceMock = omieProductInvoicesResponseMock.nfCadastro[0]
  const orderMock = { _id: '48f1af6e-be36-4e8a-85ea-23976e36e3c0', orderNumber: '000000000000013', type: 'PEDIDO' }
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const productServiceIdMock = '26b22bcb-1773-4242-b8bd-e5c2b79b694a'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'

  return {
    sut: makeProductInvoiceMapping({ providerName, helpers }),
    omieProductInvoiceMock,
    orderMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    productServiceIdMock,
    categoryIdMock
  }
}

describe('Product Invoice Mapping', () => {
  it('Should return mapped product invoice successfully', () => {
    const {
      sut,
      omieProductInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieProductInvoiceMock,
      omieInvoiceDepartment: omieProductInvoiceMock.pedido.Departamentos[0],
      omieInvoiceItem: omieProductInvoiceMock.det[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual(omieProductInvoiceParsedMock)
  })

  it('Should return mapped product invoice successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieProductInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieProductInvoiceMock,
      omieInvoiceDepartment: null,
      omieInvoiceItem: omieProductInvoiceMock.det[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual({ ...omieProductInvoiceParsedMock, departmentId: emptyRecordsIdsMock.department })
  })

  it('Should return mapped product invoice successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieProductInvoiceMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieProductInvoiceMock,
      omieInvoiceDepartment: null,
      omieInvoiceItem: omieProductInvoiceMock.det[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: null,
      companyId: companyIdMock,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null
    })

    expect(result).toEqual({
      ...omieProductInvoiceParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      productServiceId: emptyRecordsIdsMock.productService,
      orderId: emptyRecordsIdsMock.order,
      orderNumber: null,
      origin: null
    })
  })

  it('Should return mapped product invoice successfully with taxes', () => {
    const {
      sut,
      omieProductInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieProductInvoiceMock,
      omieInvoiceDepartment: omieProductInvoiceMock.pedido.Departamentos[0],
      omieInvoiceItem: { ...omieProductInvoiceMock.det[0], prod: { ...omieProductInvoiceMock.det[0].prod, vIR: 0, vPIS: 0, vCOFINS: 0, vCSLL: 0, vICMS: 0, vISS: 0 } },
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock
    })

    expect(result).toEqual(omieProductInvoiceParsedMock)
  })
})
