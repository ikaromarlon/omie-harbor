const { services: { omie: { providerName } } } = require('../../../../src/config')
const makeProductMapping = require('../../../../src/mappings/omie/productMapping')
const {
  omieProductsResponseMock,
  omieProductParsedMock
} = require('../../../mocks')

const makeSut = () => {
  const omieProductMock = omieProductsResponseMock.produto_servico_cadastro[0]
  const companyIdMock = '25c176b6-b200-4575-9217-e23c6105163c'

  return {
    sut: makeProductMapping({ providerName }),
    omieProductMock,
    companyIdMock
  }
}

describe('Product Mapping', () => {
  it('Should return mapped product successfully', () => {
    const { sut, omieProductMock, companyIdMock } = makeSut()
    const result = sut({ omieProduct: omieProductMock, companyId: companyIdMock })
    expect(result).toEqual(omieProductParsedMock)
  })

  it('Should return mapped product without characteristics', () => {
    const { sut, omieProductMock, companyIdMock } = makeSut()
    const result = sut({ omieProduct: { ...omieProductMock, caracteristicas: null }, companyId: companyIdMock })
    expect(result).toEqual({ ...omieProductParsedMock, characteristics: [] })
  })

  it('Should return mapped product without family', () => {
    const { sut, omieProductMock, companyIdMock } = makeSut()
    const result = sut({ omieProduct: { ...omieProductMock, codigo_familia: null, descricao_familia: null }, companyId: companyIdMock })
    expect(result).toEqual({ ...omieProductParsedMock, family: { code: null, description: null } })
  })
})
