module.exports = ({ providerName }) => ({ omieDepartment, companyId }) => ({
  externalId: String(omieDepartment.codigo),
  provider: providerName,
  companyId,
  description: omieDepartment.descricao,
  structure: omieDepartment.estrutura,
  parentStructure: omieDepartment.estrutura?.split('.')?.slice(0, -1)?.join('.') || null,
  isActive: omieDepartment.inativo === 'N'
})
