module.exports = ({ providerName, helpers }) => ({ omieCompany, omieCnae, credentials }) => {
  const phones = []
  if (omieCompany.telefone1_numero) phones.push({ areaCode: helpers.getNumbers(omieCompany.telefone1_ddd), number: helpers.getNumbers(omieCompany.telefone1_numero) })
  if (omieCompany.telefone2_numero) phones.push({ areaCode: helpers.getNumbers(omieCompany.telefone2_ddd), number: helpers.getNumbers(omieCompany.telefone2_numero) })
  const cnae = omieCnae.find(e => e.nCodigo === omieCompany.cnae)
  return {
    externalId: String(omieCompany.codigo_empresa),
    provider: providerName,
    credentials: {
      appKey: credentials.appKey,
      appSecret: credentials.appSecret
    },
    cnpj: helpers.getNumbers(omieCompany.cnpj),
    name: omieCompany.razao_social,
    nickName: omieCompany.nome_fantasia,
    cnae: cnae ? { code: cnae.nCodigo, description: cnae.cDescricao } : null,
    stateRegistration: omieCompany.inscricao_estadual,
    municipalRegistration: omieCompany.inscricao_municipal,
    address: {
      zipCode: helpers.getNumbers(omieCompany.cep),
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
