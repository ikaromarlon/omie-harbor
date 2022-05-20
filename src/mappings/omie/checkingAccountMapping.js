module.exports = ({ providerName, helpers: { brDateToISO } }) => ({ omieCheckingAccount, omieBanks, omieCheckingAccountTypes, companyId }) => {
  const omieBank = omieBanks.find(e => e.codigo === omieCheckingAccount.codigo_banco)
  const omieCheckingAccountType = omieCheckingAccountTypes.find(e => e.cCodigo === omieCheckingAccount.tipo)

  return {
    externalId: String(omieCheckingAccount.nCodCC),
    provider: providerName,
    companyId,
    bank: {
      code: omieBank?.codigo ?? null,
      name: omieBank?.nome ?? null
    },
    branch: omieCheckingAccount.codigo_agencia ?? null,
    number: omieCheckingAccount.numero_conta_corrente ?? null,
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
