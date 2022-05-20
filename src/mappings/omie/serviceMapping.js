module.exports = ({ providerName }) => ({ omieService, companyId }) => ({
  externalId: String(omieService.intListar.nCodServ),
  provider: providerName,
  code: String(omieService.cabecalho.cCodigo),
  ncm: null, /** only for products */
  cfop: null, /** only for products */
  municipalCode: String(omieService.cabecalho.cCodServMun),
  companyId,
  description: omieService.cabecalho.cDescricao,
  family: { code: null, description: null },
  characteristics: [],
  unity: 'UN',
  value: omieService.cabecalho.nPrecoUnit,
  type: 'SERVICO',
  notes: null,
  isActive: omieService.info.inativo === 'N'
})
