const { getNumbers } = require('../../../common/helpers')

module.exports = ({
  companyId,
  omieCustomer,
  omieCnae,
  omieActivities,
  omieBanks
}) => {
  const phones = []
  if (omieCustomer.telefone1_numero) phones.push({ areaCode: getNumbers(omieCustomer.telefone1_ddd), number: getNumbers(omieCustomer.telefone1_numero) })
  if (omieCustomer.telefone2_numero) phones.push({ areaCode: getNumbers(omieCustomer.telefone2_ddd), number: getNumbers(omieCustomer.telefone2_numero) })
  const cnae = omieCnae.find(e => e.nCodigo === omieCustomer.cnae)
  let omieBank
  if (omieCustomer.dadosBancarios.codigo_banco) omieBank = omieBanks.find(e => e.codigo === omieCustomer.dadosBancarios.codigo_banco)
  return {
    companyId,
    externalId: String(omieCustomer.codigo_cliente_omie),
    cpfcnpj: getNumbers(omieCustomer.cnpj_cpf),
    personType: omieCustomer.pessoa_fisica === 'N' ? 'J' : 'F',
    name: omieCustomer.razao_social,
    nickName: omieCustomer.nome_fantasia,
    cnae: { code: cnae?.nCodigo ?? null, description: cnae?.cDescricao ?? null },
    activity: omieActivities.find(e => e.cCodigo === omieCustomer.tipo_atividade)?.cDescricao ?? null,
    stateRegistration: omieCustomer.inscricao_estadual,
    municipalRegistration: omieCustomer.inscricao_municipal,
    address: {
      zipCode: getNumbers(omieCustomer.cep),
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
    checkingAccount: {
      bank: {
        code: omieBank?.codigo ?? null,
        name: omieBank?.nome ?? null
      },
      branch: omieCustomer.dadosBancarios.agencia ?? null,
      accountNumber: omieCustomer.dadosBancarios.conta_corrente ?? null,
      holder: {
        cpfcnpj: omieCustomer.dadosBancarios.doc_titular ? getNumbers(omieCustomer.dadosBancarios.doc_titular) : null,
        name: omieCustomer.dadosBancarios.nome_titular ?? null
      }
    },
    tags: (omieCustomer.tags ?? []).map(e => e.tag),
    characteristics: (omieCustomer.caracteristicas ?? []).map(e => ({ name: e.campo, content: e.conteudo })),
    isActive: omieCustomer.inativo === 'N'
  }
}
