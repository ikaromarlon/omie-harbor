const categoryMapping = require('../../../../../src/functions/ingestionPerformer/mappings/categoryMapping')
const {
  mockOmieCategoriesResponse,
  mockCategory,
  mockParentCategory
} = require('../../../../mocks')

delete mockCategory.id
delete mockCategory.createdAt
delete mockCategory.updatedAt
delete mockParentCategory.id
delete mockParentCategory.createdAt
delete mockParentCategory.updatedAt

const makeSut = () => {
  const [mockOmieCategory, mockOmieParentCategory] = mockOmieCategoriesResponse.categoria_cadastro
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: categoryMapping,
    mockOmieCategory,
    mockOmieParentCategory,
    mockCompanyId
  }
}

describe('Category Mapping', () => {
  it('Should return mapped category successfully', () => {
    const { sut, mockOmieCategory, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCategory: mockOmieCategory
    })
    expect(result).toEqual(mockCategory)
  })

  it('Should return mapped parent category successfully', () => {
    const { sut, mockOmieParentCategory, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieCategory: mockOmieParentCategory
    })
    expect(result).toEqual(mockParentCategory)
  })
})
