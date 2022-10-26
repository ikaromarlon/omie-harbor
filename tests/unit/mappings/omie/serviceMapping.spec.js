const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeServiceMapping = require('../../../../src/mappings/omie/serviceMapping')
const {
  mockOmieServicesResponse,
  mockParsedOmieService
} = require('../../../mocks')

const makeSut = () => {
  const mockOmieService = mockOmieServicesResponse.cadastros[0]
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeServiceMapping({ providerName }),
    mockOmieService,
    mockCompanyId
  }
}

describe('Service Mapping', () => {
  it('Should return mapped service successfully', () => {
    const { sut, mockOmieService, mockCompanyId } = makeSut()
    const result = sut({ omieService: mockOmieService, companyId: mockCompanyId })
    expect(result).toEqual(mockParsedOmieService)
  })

  it('Should return mapped service successfully without municipalServiceCode', () => {
    const { sut, mockOmieService, mockCompanyId } = makeSut()
    const result = sut({ omieService: { ...mockOmieService, cabecalho: { ...mockOmieService.cabecalho, cCodServMun: '' } }, companyId: mockCompanyId })
    expect(result).toEqual({ ...mockParsedOmieService, municipalServiceCode: null })
  })
})
