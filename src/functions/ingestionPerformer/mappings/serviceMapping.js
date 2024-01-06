const { PRODUCT_TYPES } = require('../enums')

module.exports = ({
  companyId,
  omieService
}) => ({
  companyId,
  externalId: String(omieService.intListar.nCodServ),
  code: String(omieService.cabecalho.cCodigo),
  cfop: null, /** only for products */
  municipalServiceCode: omieService.cabecalho.cCodServMun || null,
  description: omieService.cabecalho.cDescricao,
  family: { code: null, description: null },
  characteristics: [],
  unity: 'UN',
  value: omieService.cabecalho.nPrecoUnit,
  type: PRODUCT_TYPES.SERVICE,
  notes: null,
  isActive: omieService.info.inativo === 'N'
})
