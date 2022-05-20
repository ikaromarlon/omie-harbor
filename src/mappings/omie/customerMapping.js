module.exports = ({ providerName, helpers }) => ({ omieCustomer, omieCnae, omieActivities, companyId }) => {
  const phones = []
  if (omieCustomer.telefone1_numero) phones.push({ areaCode: helpers.getNumbers(omieCustomer.telefone1_ddd), number: helpers.getNumbers(omieCustomer.telefone1_numero) })
  if (omieCustomer.telefone2_numero) phones.push({ areaCode: helpers.getNumbers(omieCustomer.telefone2_ddd), number: helpers.getNumbers(omieCustomer.telefone2_numero) })
  const cnae = omieCnae.find(e => e.nCodigo === omieCustomer.cnae)
  return {
    externalId: String(omieCustomer.codigo_cliente_omie),
    provider: providerName,
    companyId,
    cpfcnpj: helpers.getNumbers(omieCustomer.cnpj_cpf),
    personType: omieCustomer.pessoa_fisica === 'N' ? 'J' : 'F',
    name: omieCustomer.razao_social,
    nickName: omieCustomer.nome_fantasia,
    cnae: { code: cnae?.nCodigo ?? null, description: cnae?.cDescricao ?? null },
    activity: omieActivities.find(e => e.cCodigo === omieCustomer.tipo_atividade)?.cDescricao ?? null,
    stateRegistration: omieCustomer.inscricao_estadual,
    municipalRegistration: omieCustomer.inscricao_municipal,
    address: {
      zipCode: helpers.getNumbers(omieCustomer.cep),
      street: omieCustomer.endereco,
      number: omieCustomer.endereco_numero,
      neighborhood: omieCustomer.bairro,
      city: omieCustomer.cidade,
      state: omieCustomer.estado,
      additionalInfo: omieCustomer.complemento
    },
    contact: omieCustomer.contato,
    email: omieCustomer.email,
    phones,
    tags: (omieCustomer.tags ?? []).map(e => e.tag),
    characteristics: (omieCustomer.caracteristicas ?? []).map(e => ({ name: e.campo, content: e.conteudo })),
    isActive: omieCustomer.inativo === 'N'
  }
}
