const { PRODUCT_TYPES } = require('../../../common/enums')

module.exports = ({
  companyId,
  omieProduct
}) => ({
  companyId,
  externalId: String(omieProduct.codigo_produto),
  code: omieProduct.codigo,
  cfop: omieProduct.cfop || null,
  municipalServiceCode: null, /** only for services */
  description: omieProduct.descricao,
  family: { code: omieProduct.codigo_familia ?? null, description: omieProduct.descricao_familia ?? null },
  characteristics: (omieProduct.caracteristicas ?? []).map(e => ({ name: e.cNomeCaract, content: e.cConteudo })),
  unity: omieProduct.unidade,
  value: omieProduct.valor_unitario,
  type: PRODUCT_TYPES.PRODUCT,
  notes: omieProduct.obs_internas,
  isActive: omieProduct.inativo === 'N'
})
