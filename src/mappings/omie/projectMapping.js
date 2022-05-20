module.exports = ({ providerName }) => ({ omieProject, companyId }) => ({
  externalId: String(omieProject.codigo),
  provider: providerName,
  companyId,
  name: omieProject.nome,
  isActive: omieProject.inativo === 'N'
})
