const { getNumbers } = require('../../common/utils')

module.exports = ({
  credentials,
  omieCompany,
  omieCnae
}) => {
  const phones = []
  if (omieCompany.telefone1_numero) phones.push({ areaCode: getNumbers(omieCompany.telefone1_ddd), number: getNumbers(omieCompany.telefone1_numero) })
  if (omieCompany.telefone2_numero) phones.push({ areaCode: getNumbers(omieCompany.telefone2_ddd), number: getNumbers(omieCompany.telefone2_numero) })
  const cnae = omieCnae.find(e => e.nCodigo === omieCompany.cnae)
  return {
    credentials: {
      appKey: credentials.appKey,
      appSecret: credentials.appSecret
    },
    externalId: String(omieCompany.codigo_empresa),
    cnpj: getNumbers(omieCompany.cnpj),
    name: omieCompany.razao_social,
    nickName: omieCompany.nome_fantasia,
    cnae: cnae ? { code: cnae.nCodigo, description: cnae.cDescricao } : null,
    stateRegistration: omieCompany.inscricao_estadual,
    municipalRegistration: omieCompany.inscricao_municipal,
    address: {
      zipCode: getNumbers(omieCompany.cep),
      street: omieCompany.endereco,
      number: omieCompany.endereco_numero,
      neighborhood: omieCompany.bairro,
      city: omieCompany.cidade,
      state: omieCompany.estado,
      additionalInfo: omieCompany.complemento
    },
    email: omieCompany.email,
    phones,
    isActive: omieCompany.inativa === 'N'
  }
}
