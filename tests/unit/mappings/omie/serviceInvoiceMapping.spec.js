const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeServiceInvoiceMapping = require('../../../../src/mappings/omie/serviceInvoiceMapping')
const {
  emptyRecordsIdsMock,
  omieServiceInvoicesResponseMock,
  omieServiceInvoiceParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const omieServiceInvoiceMock = omieServiceInvoicesResponseMock.nfseEncontradas[0]
  const orderMock = { _id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15', type: 'OS' }
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const productServiceIdMock = 'e46a6ab1-dd50-4579-b11d-d939fd35bcf3'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const contractIdMock = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: makeServiceInvoiceMapping({ providerName, helpers }),
    omieServiceInvoiceMock,
    orderMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    productServiceIdMock,
    categoryIdMock,
    contractIdMock
  }
}

describe('Service Invoice Mapping', () => {
  it('Should return mapped service invoice successfully', () => {
    const {
      sut,
      omieServiceInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieServiceInvoiceMock,
      omieInvoiceDepartment: omieServiceInvoiceMock.OrdemServico.Departamentos[0],
      omieInvoiceItem: omieServiceInvoiceMock.ListaServicos[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual(omieServiceInvoiceParsedMock)
  })

  it('Should return mapped service invoice successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieServiceInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieServiceInvoiceMock,
      omieInvoiceDepartment: null,
      omieInvoiceItem: omieServiceInvoiceMock.ListaServicos[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieServiceInvoiceParsedMock, departmentId: emptyRecordsIdsMock.department })
  })

  it('Should return mapped service invoice successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieServiceInvoiceMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieServiceInvoiceMock,
      omieInvoiceDepartment: null,
      omieInvoiceItem: omieServiceInvoiceMock.ListaServicos[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: null,
      companyId: companyIdMock,
      customerId: null,
      projectId: null,
      departmentId: null,
      productServiceId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...omieServiceInvoiceParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      productServiceId: emptyRecordsIdsMock.productService,
      contractId: emptyRecordsIdsMock.contract,
      orderId: emptyRecordsIdsMock.order,
      orderNumber: null,
      origin: null
    })
  })

  it('Should return mapped service invoice successfully without document data', () => {
    const {
      sut,
      omieServiceInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: { ...omieServiceInvoiceMock, Cabecalho: { ...omieServiceInvoiceMock.Cabecalho, nChaveNFe: undefined, nNumeroNFSe: undefined } },
      omieInvoiceDepartment: omieServiceInvoiceMock.OrdemServico.Departamentos[0],
      omieInvoiceItem: omieServiceInvoiceMock.ListaServicos[0],
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieServiceInvoiceParsedMock, documentKey: null, documentNumber: null })
  })

  it('Should return mapped service invoice successfully without some taxes', () => {
    const {
      sut,
      omieServiceInvoiceMock,
      orderMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      productServiceIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieInvoice: omieServiceInvoiceMock,
      omieInvoiceDepartment: omieServiceInvoiceMock.OrdemServico.Departamentos[0],
      omieInvoiceItem: { ...omieServiceInvoiceMock.ListaServicos[0], nValorICMS: undefined, nValorISS: undefined },
      emptyRecordsIds: emptyRecordsIdsMock,
      order: orderMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      productServiceId: productServiceIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual(omieServiceInvoiceParsedMock)
  })
})
