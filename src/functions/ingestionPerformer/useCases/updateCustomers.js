module.exports = async ({
  omieService,
  credentials,
  companyId,
  startDate,
  endDate,
  omieCnae,
  omieBanks,
  customerMapping,
  customersRepository
}) => {
  const omieCustomers = await omieService.getCustomers(credentials, { startDate, endDate })
  if (omieCustomers.length) {
    const omieActivities = await omieService.getActivities(credentials)
    const customers = omieCustomers.map(omieCustomer => customerMapping({ omieCustomer, omieActivities, omieCnae, omieBanks, companyId }))
    if (customers.length) {
      await customersRepository.createOrUpdateMany(customers, ['companyId', 'externalId'])
    }
  }
}
