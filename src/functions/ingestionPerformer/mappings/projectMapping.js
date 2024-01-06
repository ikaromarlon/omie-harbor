module.exports = ({ omieProject, companyId }) => ({
  companyId,
  externalId: String(omieProject.codigo),
  name: omieProject.nome,
  isActive: omieProject.inativo === 'N'
})
