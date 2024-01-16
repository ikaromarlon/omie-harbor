const serviceMapping = require('../../../../../src/functions/ingestionPerformer/mappings/serviceMapping')
const {
  mockOmieServicesResponse,
  mockService
} = require('../../../../mocks')

delete mockService.id
delete mockService.createdAt
delete mockService.updatedAt

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
    expect(result).toEqual(mockService)
  })

  it('Should return mapped service successfully without municipalServiceCode', () => {
    const { sut, mockOmieService, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieService: { ...mockOmieService, cabecalho: { ...mockOmieService.cabecalho, cCodServMun: '' } }
    })
    expect(result).toEqual({ ...mockService, municipalServiceCode: null })
  })
})
