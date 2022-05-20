module.exports = ({ providerName }) => ({ omieCategory, companyId }) => ({
  externalId: String(omieCategory.codigo),
  provider: providerName,
  companyId,
  description: omieCategory.descricao,
  structure: omieCategory.codigo,
  accountId: omieCategory.id_conta_contabil,
  parentStructure: omieCategory.categoria_superior?.length > 1 ? omieCategory.categoria_superior : null,
  isActive: omieCategory.nao_exibir === 'N'
})
