const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeCategoryMapping = require('../../../../src/mappings/omie/categoryMapping')
const {
  omieCategoriesResponseMock,
  omieCategoryParsedMock,
  omieCategoryParentParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const [omieCategoryMock, omieCategoryParentMock] = omieCategoriesResponseMock.categoria_cadastro
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeCategoryMapping({ providerName }),
    omieCategoryMock,
    omieCategoryParentMock,
    companyIdMock
  }
}

describe('Category Mapping', () => {
  it('Should return mapped category successfully', () => {
    const { sut, omieCategoryMock, companyIdMock } = makeSut()
    const result = sut({ omieCategory: omieCategoryMock, companyId: companyIdMock })
    expect(result).toEqual(omieCategoryParsedMock)
  })

  it('Should return mapped parent category successfully', () => {
    const { sut, omieCategoryParentMock, companyIdMock } = makeSut()
    const result = sut({ omieCategory: omieCategoryParentMock, companyId: companyIdMock })
    expect(result).toEqual(omieCategoryParentParsedMock)
  })
})
