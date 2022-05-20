const { services: { omie: { providerName } } } = require('../../../../src/config')
const helpers = require('../../../../src/utils/helpers')
const makeCustomerMapping = require('../../../../src/mappings/omie/customerMapping')
const {
  omieCustomersResponseMock,
  omieCustomerParsedMock,
  omieCnaeResponseMock,
  omieActivitiesResponseMock
} = require('../../../mocks')

const makeSut = () => {
  const omieCustomerMock = omieCustomersResponseMock.clientes_cadastro[0]
  const omieCnaeMock = omieCnaeResponseMock.cadastros
  const omieActivitiesMock = omieActivitiesResponseMock.lista_tipos_atividade
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeCustomerMapping({ providerName, helpers }),
    omieCustomerMock,
    omieCnaeMock,
    omieActivitiesMock,
    companyIdMock
  }
}

describe('Customer Mapping', () => {
  it('Should return mapped customer successfully', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: omieCustomerMock, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual(omieCustomerParsedMock)
  })

  it('Should return mapped customer without first phone', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, telefone1_ddd: '', telefone1_numero: '' }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, phones: [{ ...omieCustomerParsedMock.phones[1] }] })
  })

  it('Should return mapped customer without second phone', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, telefone2_ddd: '', telefone2_numero: '' }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, phones: [{ ...omieCustomerParsedMock.phones[0] }] })
  })

  it('Should return mapped customer without cnae', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, cnae: null }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, cnae: { code: null, description: null } })
  })

  it('Should return mapped customer without activity', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, tipo_atividade: null }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, activity: null })
  })

  it('Should return mapped customer without characteristics', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, caracteristicas: null }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, characteristics: [] })
  })

  it('Should return mapped customer without tags', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, tags: null }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, tags: [] })
  })

  it('Should return mapped customer for non legal persons', () => {
    const { sut, omieCustomerMock, omieCnaeMock, omieActivitiesMock, companyIdMock } = makeSut()
    const result = sut({ omieCustomer: { ...omieCustomerMock, pessoa_fisica: 'S' }, omieCnae: omieCnaeMock, omieActivities: omieActivitiesMock, companyId: companyIdMock })
    expect(result).toEqual({ ...omieCustomerParsedMock, personType: 'F' })
  })
})
