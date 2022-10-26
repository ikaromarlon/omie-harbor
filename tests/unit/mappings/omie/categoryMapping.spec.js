const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeCategoryMapping = require('../../../../src/mappings/omie/categoryMapping')
const {
  mockOmieCategoriesResponse,
  mockParsedOmieCategory,
  mockParsedOmieParentCategory
} = require('../../../mocks')

const makeSut = () => {
  const [mockOmieCategory, mockOmieParentCategory] = mockOmieCategoriesResponse.categoria_cadastro
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeCategoryMapping({ providerName }),
    mockOmieCategory,
    mockOmieParentCategory,
    mockCompanyId
  }
}

describe('Category Mapping', () => {
  it('Should return mapped category successfully', () => {
    const { sut, mockOmieCategory, mockCompanyId } = makeSut()
    const result = sut({ omieCategory: mockOmieCategory, companyId: mockCompanyId })
    expect(result).toEqual(mockParsedOmieCategory)
  })

  it('Should return mapped parent category successfully', () => {
    const { sut, mockOmieParentCategory, mockCompanyId } = makeSut()
    const result = sut({ omieCategory: mockOmieParentCategory, companyId: mockCompanyId })
    expect(result).toEqual(mockParsedOmieParentCategory)
  })
})
