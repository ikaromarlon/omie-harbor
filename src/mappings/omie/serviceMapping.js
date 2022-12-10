const { PRODUCT_TYPES } = require('../../common/enums')

module.exports = ({ providerName }) => ({ omieService, companyId }) => ({
  externalId: String(omieService.intListar.nCodServ),
  provider: providerName,
  code: String(omieService.cabecalho.cCodigo),
  cfop: null, /** only for products */
  municipalServiceCode: omieService.cabecalho.cCodServMun || null,
  companyId,
  description: omieService.cabecalho.cDescricao,
  family: { code: null, description: null },
  characteristics: [],
  unity: 'UN',
  value: omieService.cabecalho.nPrecoUnit,
  type: PRODUCT_TYPES.SERVICE,
  notes: null,
  isActive: omieService.info.inativo === 'N'
})
