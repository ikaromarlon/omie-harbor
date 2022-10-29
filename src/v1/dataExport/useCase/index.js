module.exports = ({
  repositories,
  logger,
  bucket
}) => async ({ payload }) => {
  const { companyId } = payload

  const filter = {}
  if (companyId) filter._id = companyId

  const companies = await repositories.companies.find(filter)

  await Promise.all(companies.map(async (company) => {
    const { _id: companyId, name } = company

    logger.info({ title: 'Data Export', message: `Getting data from database for company ${companyId} - ${name}` })

    const [
      categories,
      departments,
      projects,
      customers,
      productsServices,
      checkingAccounts,
      contracts,
      orders,
      billing,
      accountsPayable,
      accountsReceivable,
      financialMovements
    ] = await Promise.all([
      repositories.categories.find({ companyId }),
      repositories.departments.find({ companyId }),
      repositories.projects.find({ companyId }),
      repositories.customers.find({ companyId }),
      repositories.productsServices.find({ companyId }),
      repositories.checkingAccounts.find({ companyId }),
      repositories.contracts.find({ companyId }),
      repositories.orders.find({ companyId }),
      repositories.billing.find({ companyId }),
      repositories.accountsPayable.find({ companyId }),
      repositories.accountsReceivable.find({ companyId }),
      repositories.financialMovements.find({ companyId })
    ])

    logger.info({ title: 'Data Export', message: `Uploading data to bucket for company ${companyId} - ${name}` })

    await bucket.storeCompanyData(companyId, {
      companies: [company],
      categories,
      departments,
      projects,
      customers,
      productsServices,
      checkingAccounts,
      contracts,
      orders,
      billing,
      accountsPayable,
      accountsReceivable,
      financialMovements
    })

    logger.info({ title: 'Data Export', message: `Data export completed for company ${companyId} - ${name}` })
  }))

  return { success: true }
}
