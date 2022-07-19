const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeTitleMapping = require('../../../../src/mappings/omie/titleMapping')
const {
  emptyRecordsIdsMock,
  omieAccountsReceivableResponseMock,
  omieAccountReceivableParsedMock,
  omieDocumentTypesResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieTitleMock = omieAccountsReceivableResponseMock.titulosEncontrados[0]
  const omieDocumentTypesMock = omieDocumentTypesResponseMock.tipo_documento_cadastro
  const orderMock = { _id: '854806eb-b46f-476d-9d3c-88e1bdf17c95', orderNumber: '15', type: 'OS' }
  const billingMock = { _id: '7be89715-63e6-426a-a952-ae19b700a28f', type: 'NFS-e' }
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'
  const customerIdMock = '3a58bc83-dec0-436e-a98c-20fba8f58b56'
  const projectIdMock = '3fbf0118-b5f9-48b0-8269-40cf0fd28d55'
  const departmentIdMock = '5f008bd0-cc25-4433-9cff-a5d9fdd79642'
  const categoryIdMock = '44d50267-4bc1-42bc-923a-00df2968a2be'
  const contractIdMock = '9f9bdfdd-2851-471c-b9e9-a798a3090d93'

  return {
    sut: makeTitleMapping({ providerName, helpers }),
    omieTitleMock,
    omieDocumentTypesMock,
    orderMock,
    billingMock,
    companyIdMock,
    customerIdMock,
    projectIdMock,
    departmentIdMock,
    categoryIdMock,
    contractIdMock
  }
}

describe('Title Mapping', () => {
  it('Should return mapped title successfully', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieTitle: omieTitleMock,
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: omieTitleMock.departamentos[0],
      omieTitleCategory: omieTitleMock.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual(omieAccountReceivableParsedMock)
  })

  it('Should return mapped title successfully without documentNumber', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieTitle: { ...omieTitleMock, cabecTitulo: { ...omieTitleMock.cabecTitulo, cNumDocFiscal: undefined } },
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: omieTitleMock.departamentos[0],
      omieTitleCategory: omieTitleMock.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieAccountReceivableParsedMock, documentNumber: null })
  })

  it('Should return mapped title successfully missing some dates', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieTitle: { ...omieTitleMock, cabecTitulo: { ...omieTitleMock.cabecTitulo, dDtEmissao: undefined, dDtPagamento: undefined } },
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: omieTitleMock.departamentos[0],
      omieTitleCategory: omieTitleMock.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieAccountReceivableParsedMock, issueDate: null, paymentDate: null })
  })

  it('Should return mapped title successfully without category: use emptyRecordsIds.category instead', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieTitle: omieTitleMock,
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: omieTitleMock.departamentos[0],
      omieTitleCategory: null,
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: null,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieAccountReceivableParsedMock, categoryId: emptyRecordsIdsMock.category })
  })

  it('Should return mapped title successfully without department: use emptyRecordsIds.department instead', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieTitle: omieTitleMock,
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: null,
      omieTitleCategory: omieTitleMock.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: null,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual({ ...omieAccountReceivableParsedMock, departmentId: emptyRecordsIdsMock.department })
  })

  it('Should return mapped title successfully without relationships ids: use emptyRecordsIds instead', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      companyIdMock
    } = makeSut()

    const result = sut({
      omieTitle: omieTitleMock,
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: null,
      omieTitleCategory: null,
      omieDocumentTypes: omieDocumentTypesMock,
      order: null,
      billing: null,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: null,
      projectId: null,
      departmentId: null,
      categoryId: null,
      contractId: null
    })

    expect(result).toEqual({
      ...omieAccountReceivableParsedMock,
      categoryId: emptyRecordsIdsMock.category,
      departmentId: emptyRecordsIdsMock.department,
      projectId: emptyRecordsIdsMock.project,
      customerId: emptyRecordsIdsMock.customer,
      contractId: emptyRecordsIdsMock.contract,
      orderId: emptyRecordsIdsMock.order,
      orderNumber: null,
      billingId: emptyRecordsIdsMock.billing,
      origin: null
    })
  })

  it('Should return mapped title successfully without taxes', () => {
    const {
      sut,
      omieTitleMock,
      omieDocumentTypesMock,
      orderMock,
      billingMock,
      companyIdMock,
      customerIdMock,
      projectIdMock,
      departmentIdMock,
      categoryIdMock,
      contractIdMock
    } = makeSut()

    const result = sut({
      omieTitle: { ...omieTitleMock, cabecTitulo: { ...omieTitleMock.cabecTitulo, nValorIR: undefined, nValorPIS: undefined, nValorCOFINS: undefined, nValorCSLL: undefined, nValorICMS: undefined, nValorISS: undefined } },
      omieTitleEntries: omieTitleMock.lancamentos,
      omieTitleDepartment: omieTitleMock.departamentos[0],
      omieTitleCategory: omieTitleMock.cabecTitulo.aCodCateg[0],
      omieDocumentTypes: omieDocumentTypesMock,
      order: orderMock,
      billing: billingMock,
      emptyRecordsIds: emptyRecordsIdsMock,
      companyId: companyIdMock,
      customerId: customerIdMock,
      projectId: projectIdMock,
      departmentId: departmentIdMock,
      categoryId: categoryIdMock,
      contractId: contractIdMock
    })

    expect(result).toEqual(omieAccountReceivableParsedMock)
  })
})
