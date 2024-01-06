const serviceMapping = require('../../../../../src/functions/ingestionPerformer/mappings/serviceMapping')
const {
  mockOmieServicesResponse,
  mockParsedOmieService
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieService = mockOmieServicesResponse.cadastros[0]
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: serviceMapping,
    mockOmieService,
    mockCompanyId
  }
}

describe('Service Mapping', () => {
  it('Should return mapped service successfully', () => {
    const { sut, mockOmieService, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieService: mockOmieService
    })
    expect(result).toEqual(mockParsedOmieService)
  })

  it('Should return mapped service successfully without municipalServiceCode', () => {
    const { sut, mockOmieService, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieService: { ...mockOmieService, cabecalho: { ...mockOmieService.cabecalho, cCodServMun: '' } }
    })
    expect(result).toEqual({ ...mockParsedOmieService, municipalServiceCode: null })
  })
})
