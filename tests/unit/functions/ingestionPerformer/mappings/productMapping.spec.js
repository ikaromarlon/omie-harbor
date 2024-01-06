const productMapping = require('../../../../../src/functions/ingestionPerformer/mappings/productMapping')
const {
  mockOmieProductsResponse,
  mockParsedOmieProduct
} = require('../../../../mocks')

const makeSut = () => {
  const mockOmieProduct = mockOmieProductsResponse.produto_servico_cadastro[0]
  const mockCompanyId = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: productMapping,
    mockOmieProduct,
    mockCompanyId
  }
}

describe('Product Mapping', () => {
  it('Should return mapped product successfully', () => {
    const { sut, mockOmieProduct, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieProduct: mockOmieProduct
    })
    expect(result).toEqual(mockParsedOmieProduct)
  })

  it('Should return mapped product without characteristics', () => {
    const { sut, mockOmieProduct, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieProduct: { ...mockOmieProduct, caracteristicas: null }
    })
    expect(result).toEqual({ ...mockParsedOmieProduct, characteristics: [] })
  })

  it('Should return mapped product without family', () => {
    const { sut, mockOmieProduct, mockCompanyId } = makeSut()
    const result = sut({
      companyId: mockCompanyId,
      omieProduct: { ...mockOmieProduct, codigo_familia: null, descricao_familia: null }
    })
    expect(result).toEqual({ ...mockParsedOmieProduct, family: { code: null, description: null } })
  })
})
