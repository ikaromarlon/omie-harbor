module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  omieBanks,
  checkingAccountMapping,
  checkingAccountsRepository
}) => {
  const omieCheckingAccounts = await omieService.getCheckingAccounts(credentials, { startDate, endDate })
  if (omieCheckingAccounts.length) {
    const omieCheckingAccountTypes = await omieService.getCheckingAccountTypes(credentials)
    const checkingAccounts = omieCheckingAccounts.map(omieCheckingAccount => checkingAccountMapping({ omieCheckingAccount, omieBanks, omieCheckingAccountTypes, companyId }))
    await checkingAccountsRepository.createOrUpdateMany(checkingAccounts, ['companyId', 'externalId'])
  }
}
