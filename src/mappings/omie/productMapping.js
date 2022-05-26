module.exports = ({ providerName }) => ({ omieProduct, companyId }) => ({
  externalId: String(omieProduct.codigo_produto),
  provider: providerName,
  code: omieProduct.codigo,
  cfop: omieProduct.cfop || null,
  municipalServiceCode: null, /** only for services */
  companyId,
  description: omieProduct.descricao,
  family: { code: omieProduct.codigo_familia ?? null, description: omieProduct.descricao_familia ?? null },
  characteristics: (omieProduct.caracteristicas ?? []).map(e => ({ name: e.cNomeCaract, content: e.cConteudo })),
  unity: omieProduct.unidade,
  value: omieProduct.valor_unitario,
  type: 'PRODUTO',
  notes: omieProduct.obs_internas,
  isActive: omieProduct.inativo === 'N'
})
