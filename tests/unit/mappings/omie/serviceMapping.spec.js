const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeServiceMapping = require('../../../../src/mappings/omie/serviceMapping')
const {
  omieServicesResponseMock,
  omieServiceParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const omieServiceMock = omieServicesResponseMock.cadastros[0]
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeServiceMapping({ providerName }),
    omieServiceMock,
    companyIdMock
  }
}

describe('Service Mapping', () => {
  it('Should return mapped service successfully', () => {
    const { sut, omieServiceMock, companyIdMock } = makeSut()
    const result = sut({ omieService: omieServiceMock, companyId: companyIdMock })
    expect(result).toEqual(omieServiceParsedMock)
  })

  it('Should return mapped service successfully without municipalServiceCode', () => {
    const { sut, omieServiceMock, companyIdMock } = makeSut()
    const result = sut({ omieService: { ...omieServiceMock, cabecalho: { ...omieServiceMock.cabecalho, cCodServMun: '' } }, companyId: companyIdMock })
    expect(result).toEqual({ ...omieServiceParsedMock, municipalServiceCode: null })
  })
})
