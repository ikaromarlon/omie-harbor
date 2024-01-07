const { brDateToISO } = require('../../../common/utils')

module.exports = ({
  companyId,
  omieCheckingAccount,
  omieBanks,
  omieCheckingAccountTypes
}) => {
  const omieBank = omieBanks.find(e => e.codigo === omieCheckingAccount.codigo_banco)
  const omieCheckingAccountType = omieCheckingAccountTypes.find(e => e.cCodigo === omieCheckingAccount.tipo)

  return {
    companyId,
    externalId: String(omieCheckingAccount.nCodCC),
    bank: {
      code: omieBank?.codigo ?? null,
      name: omieBank?.nome ?? null
    },
    branch: omieCheckingAccount.codigo_agencia ?? null,
    accountNumber: omieCheckingAccount.numero_conta_corrente ?? null,
    description: omieCheckingAccount.descricao,
    type: {
      code: omieCheckingAccountType?.cCodigo ?? null,
      description: omieCheckingAccountType?.cDescricao ?? null
    },
    initialBalance: omieCheckingAccount.saldo_inicial ?? null,
    initialBalanceDate: omieCheckingAccount.saldo_data ? brDateToISO(omieCheckingAccount.saldo_data) : null,
    blocked: omieCheckingAccount.bloqueado === 'S',
    isActive: omieCheckingAccount.inativo === 'N'
  }
}
